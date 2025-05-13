<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import { userHeader } from "@/components/users/users/listView/utils";
import { UserListingType, UserInsertType } from "@/components/users/types";
import Status from "@/app/common/components/Status.vue";
import TableAction from "@/app/common/components/TableAction.vue";
import CreateUpdateUserModal from "@/components/users/users/CreateUpdateUserModal.vue";
import ViewUserModal from "@/components/users/users/ViewUserModal.vue";
import { formateDate } from "@/app/common/dateFormate";
import { useRouter } from "vue-router";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import { useUserStore } from "@/store/userStore";
import { userService } from "@/app/http/httpServiceProvider"; 
import { useToast } from 'vue-toastification';
import { useI18n } from "vue-i18n";
import DataTableServer from "@/app/common/components/DataTableServer.vue"
import CreateEditDialog from "@/components/realEstate/CreateEditDialog.vue";

const { t } = useI18n();
//criacao da mensagem toast
const toast = useToast();

const userStore = useUserStore();

const dialog = ref(false);
const viewDialog = ref(false);
const userData = ref<UserListingType | null>(null);

const deleteDialog = ref(false);
const deleteId = ref<number | null>(null);
const deleteLoading = ref(false);

// Estado do componente
const searchQuery = ref("")
const searchProps = "firstName,lastName,email" // Campos de pesquisa
const itemsPerPage = ref(2)
const selectedUsers = ref<any[]>([]) /// Armazena os funcionários selecionados


// Computed properties
const loadingList = computed(() => userStore.loading)
const totalItems = computed(() => userStore.pagination.totalElements)

// Observa mudanças nos funcionários selecionados
watch(selectedUsers, (newSelection) => {
  console.log('Funcionários selecionados:', newSelection)
}, { deep: true })


const fetchUsers = async ({ page, itemsPerPage, sortBy, search }) => {
  await userStore.fetchUsers(
    page - 1, // Ajuste para API que começa em 0
    itemsPerPage,
    sortBy[0]?.key || 'createdAt',
    sortBy[0]?.order || 'asc',
    search, // query_values
    searchProps // query_props
  )
}

const toggleSelection = (item) => {
  const index = selectedUsers.value.findIndex(selected => selected.id === item.id);
  if (index === -1) {
    selectedUsers.value = [...selectedUsers.value, item];
  } else {
    selectedUsers.value = selectedUsers.value.filter(selected => selected.id !== item.id);
  }
};


//Editar ou Criar utilizador
watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    userData.value = null;
  }
});


const onCreateEditClick = (data: UserListingType | null) => {
  console.log('data user---------------', data);

  if (!data) {
    userData.value = {
      id: -1,
      firstName: "",
      lastName: "",
      email: "",
      password:"",
    };
  } else {
    //console.log('data userdata', data);
    userData.value = data;
    //console.log('userData.value', userData.value);

  }

  dialog.value = true;
};

const onSubmit = async (data: UserListingType, callbacks?: {
  onSuccess?: () => void,
  onFinally?: () => void
}) => {
  try {
    if (!data.id) {
      //console.log('insert');
      await userService.createUser(data);
      toast.success(t('t-toast-message-created'));
    } else {
      //console.log('update');
      await userService.updateUser(data.id, data);
      toast.success(t('t-toast-message-update'));
    }

    // Recarrega os dados
    await userStore.fetchUsers(0, itemsPerPage.value)
    
    // Callback de sucesso (fecha a modal)
    callbacks?.onSuccess?.();
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);
    toast.error(t('t-message-save-error'));

  } finally {
    // Callback para desativar o loading
    callbacks?.onFinally?.();
  }
};


//Consulta do utilizador
watch(viewDialog, (newVal: boolean) => {
  if (!newVal) {
    userData.value = null;
  }
});

const onViewClick = (data: UserListingType | null) => {
  if (!data) {
    userData.value = {
      id: -1,
      firstName: "",
      lastName: "",
      email: "",
      password:"",

    };
  } else {
    //console.log('data userdata', data);
    userData.value = data;
    //console.log('userData.value', userData.value);
  }
  viewDialog.value = true;
};


//Delete do utilizador
watch(deleteDialog, (newVal: boolean) => {
  if (!newVal) {
    deleteId.value = null;
  }
});
const onDelete = (id: number) => {
  deleteId.value = id;
  //console.log('delete id', deleteId.value);
  deleteDialog.value = true;
};

const onConfirmDelete = async () => {
  deleteLoading.value = true;

  try {
    await userService.deleteUser(deleteId.value!);

    await userStore.fetchUsers(0, itemsPerPage.value)
    
    toast.success(t('t-toast-message-deleted'));
  } catch (error) {
    toast.error(t('t-toast-message-deleted-erros'));
    console.error("Delete error:", error);
  } finally {
    deleteLoading.value = false;
    deleteDialog.value = false;
  }

  
};

</script>
<template>
  <v-card>
    <v-card-title class="mt-2">
      <v-row justify="space-between">
        <v-col lg="3">
          <QuerySearch v-model="searchQuery" :placeholder="$t('t-search-for-users')" />
        </v-col>
        <v-col lg="auto">
          <v-btn color="secondary" @click="onCreateEditClick(null)">
            <i class="ph-user-plus me-1" /> {{ $t('t-add-user') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="mt-2">
      <DataTableServer
        v-model="selectedUsers"
        :headers="userHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :items="userStore.users"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        :loading="loadingList"
        :search-query="searchQuery"
        :search-props="searchProps" 
        @load-items="fetchUsers"
        item-value="id"
        show-select
      >
      <template #body="{ items }">
          <tr v-for="item in items" :key="item.id" height="50">
            <td>
              <v-checkbox
                :model-value="selectedUsers.some(selected => selected.id === item.id)"
                @update:model-value="toggleSelection(item)"
                hide-details
                density="compact"
              />
            </td>
            <td>
              {{ item.firstName }} {{ item.lastName }} 
            </td>
            <td>{{ item.email }}</td>
            <td>
              <Status :status="item.enabled ? 'active' : 'unactive'" />
            </td>
            <td>
              <TableAction @onEdit="onCreateEditClick(item)" @onView="onViewClick(item)" @onDelete="onDelete(item.id)" />
            </td>
          </tr>
        </template>
      </DataTableServer>

      <div v-if="!fetchUsers.length" class="text-center pa-7">
        <div class="mb-3">
          <v-avatar color="primary" variant="tonal" size="x-large">
            <i class="ph-magnifying-glass ph-lg"></i>
          </v-avatar>
        </div>
        <div class="text-subtitle-1 font-weight-bold">
          {{ $t('t-search-not-found-message') }}
        </div>
      </div>
    </v-card-text>
  </v-card>

  <CreateUpdateUserModal v-if="userData" v-model="dialog" :data="userData" @onSubmit="onSubmit" />

  <ViewUserModal v-if="userData" v-model="viewDialog" :data="userData" />

  <RemoveItemConfirmationDialog v-if="deleteId" v-model="deleteDialog" @onConfirm="onConfirmDelete" :loading="deleteLoading" />
</template>
