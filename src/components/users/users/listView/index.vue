<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import QuerySearch from "@/app/common/components/filters/QuerySearch.vue";
import Table from "@/app/common/components/Table.vue";
import { listViewHeader } from "@/components/users/users/listView/utils";
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
import { Options } from "@/components/users/users/listView/utils";
import ChangePasswordModal from "@/components/users/users/ChangePasswordModal.vue";
import { changePasswordType } from "@/components/users/types";
import { onBeforeUnmount } from "vue";
import { changePasswordListingType } from "@/components/users/types";


const { t } = useI18n();
//criacao da mensagem toast
const toast = useToast();

const userStore = useUserStore();

const router = useRouter();
const dialog = ref(false);
const viewDialog = ref(false);
const userData = ref<UserListingType | null>(null);
const passwordDialog = ref(false);

const deleteDialog = ref(false);
const deleteId = ref<number | null>(null);
const deleteLoading = ref(false);
const isSelectAll = ref(false);
const changePasswordUserId = ref<number | null>(null);
// Junto com as outras refs
const changePasswordUser = ref<changePasswordListingType | null>(null);

const errorMsg = ref("");
let alertTimeout: ReturnType<typeof setTimeout> | null = null;


const handleApiError = (error: any) => {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }

  // Se o erro vier em formato de resposta do backend
  const message =
    error?.response?.data?.error.errors.passwordsMatching[0]    ||
    error?.message ||
    t("t-message-save-error");

  errorMsg.value = message;

  alertTimeout = setTimeout(() => {
    errorMsg.value = "";
    alertTimeout = null;
  }, 5000);
};

onBeforeUnmount(() => {
  if (alertTimeout) {
    clearTimeout(alertTimeout);
    alertTimeout = null;
  }
});

const mappedData = computed(() =>
  userStore.users.map((item) => ({
    ...item,
    isCheck: false,
  })).toReversed()
);

const filteredData = ref<UserListingType[]>([]);
const finalData = ref<UserListingType[]>([]);

watch(mappedData, (newVal) => {
  filteredData.value = newVal;
  finalData.value = newVal;
}, { immediate: true });

onMounted(() => {
  userStore.fetchUsers();
  getPaginatedData();
});

const query = ref("");

const page = ref(1);
const noOfItems = computed(() => {
  return finalData.value.length;
});
const tableData = ref<UserListingType[]>([]);
const loading = ref(false);

const config = ref({
  page: page.value,
  start: 0,
  end: 0,
  noOfItems: noOfItems.value,
  itemsPerPage: 10,
});

const getPaginatedData = () => {
  const { itemsPerPage, page } = config.value;
  const start = (page - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  end = end <= noOfItems.value ? end : noOfItems.value;

  config.value = {
    ...config.value,
    start,
    end,
  };

  const data = finalData.value.slice(config.value.start, config.value.end);

  loading.value = true;
  tableData.value = [];

  setTimeout(() => {
    tableData.value = data;
    loading.value = false;
  }, 200);
};



watch(page, (newPage: number) => {
  config.value.page = newPage;
  getPaginatedData();
});

watch(filteredData, (newData: UserListingType[]) => {
  updateTableData(newData);
});

const updateTableData = (newVal: UserListingType[]) => {
  loading.value = true;
  const { itemsPerPage } = config.value;

  const start = 1;
  let end = start + itemsPerPage;
  end = end <= newVal.length ? end : newVal.length;
  tableData.value = [];

  setTimeout(() => {
    tableData.value = newVal;
    config.value = {
      ...config.value,
      start,
      end,
      noOfItems: newVal.length,
    };
    loading.value = false;
  }, 200);
};

watch(query, (newQuery: string) => {
  filteredData.value = finalData.value.filter((item) => {
    const val = newQuery.toLowerCase();
    if (
      item.firstName.toLowerCase().includes(val) ||
      item.email.includes(val) ||
      item.username.includes(val)
    ) {
      return item;
    }
  });
  updateTableData(filteredData.value);
});

//Criação e edição do utilizador

watch(dialog, (newVal: boolean) => {
  if (!newVal) {
    userData.value = null;
  }
});

const onCreateEditClick = (data: UserListingType | null) => {
  if (!data) {
    userData.value = {
      id: -1,
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",

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
    await userStore.fetchUsers();

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


const onSubmitChangePassword = async (data: changePasswordType, callbacks?: {
  onSuccess?: () => void,
  onFinally?: () => void
}) => {
  try {
    if (!changePasswordUserId.value) {
      toast.error(t('t-message-user-not-selected'));
      return;
    }

    await userService.changePasswordUser(changePasswordUserId.value, data);
    toast.success(t('t-toast-message-created'));
    callbacks?.onSuccess?.();
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    toast.error(t('t-message-save-error'));
    handleApiError(error);
  } finally {
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
      username: "",
      password: "",

    };
  } else {
    //console.log('data userdata', data);
    userData.value = data;
    console.log('userData.value', userData.value);
  }
  viewDialog.value = true;
};

watch(passwordDialog, (val) => {
  if (!val) {
    changePasswordUser.value = null;
    errorMsg.value = ""; // limpa o erro ao fechar
  }
});

const onChangePassword = (data: UserListingType | null) => {
  if (!data) return;

  // Transforma o UserListingType num objeto do tipo changePasswordListingType
  changePasswordUser.value = {
    id: data.id,
    newPassword: "",
    confirmPassword: "",
    passwordsMatching: true,
  };

  changePasswordUserId.value = data.id;
  passwordDialog.value = true;
};

//Delete do utilizador
watch(deleteDialog, (newVal: boolean) => {
  if (!newVal) {
    deleteId.value = null;
  }
});
const onDelete = (id: number) => {
  deleteId.value = id;
  console.log('delete id', deleteId.value);
  deleteDialog.value = true;
};

const onConfirmDelete = async () => {
  deleteLoading.value = true;

  try {
    await userService.deleteUser(deleteId.value!);

    filteredData.value = filteredData.value.filter(
      (item) => item.id !== deleteId.value
    );
    finalData.value = [...filteredData.value];
    updateTableData(filteredData.value);

    toast.success(t('t-toast-message-deleted'));
  } catch (error) {
    toast.error(t('t-toast-message-deleted-erros'));
    console.error("Delete error:", error);
  } finally {
    deleteLoading.value = false;
    deleteDialog.value = false;
  }
};

const onSelect = (option: string, data: UserListingType) => {
  switch (option) {
    case "view":
      onViewClick(data);
      break;
    case "edit":
      onCreateEditClick(data);
      break;
    case "delete":
      onDelete(data.id);
      break;
    case "change":
      onChangePassword(data); // <-- correto
      break;

  }
};

</script>
<template>
  <v-card>
    <v-card-title class="mt-2">
      <v-row justify="space-between">
        <v-col lg="3">
          <QuerySearch v-model="query" :placeholder="$t('t-search-for-users')" />
        </v-col>
        <v-col lg="auto">
          <v-btn color="secondary" @click="onCreateEditClick(null)">
            <i class="ph-user-plus me-1" /> {{ $t('t-add-user') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="mt-2">
      <Table v-model="page" :headerItems="listViewHeader.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
        :config="config" :loading="loading" is-pagination @on-select-all="onSelectAll">
        <template #body>
          <tr v-for="(item, index) in tableData" :key="'agent-listing-item-' + index" height="50">
            <td>
              <v-checkbox v-model="item.isCheck" hide-details color="primary" />
            </td>
            <td>
              {{ item.firstName }} {{ item.lastName }}
            </td>
            <td>{{ item.email }}</td>
            <td>{{ item.username }}</td>
            <td>
              <Status :status="item.enabled ? 'active' : 'unactive'" />
            </td>
            <!-- <td>
              <TableAction @onEdit="onCreateEditClick(item)" @onView="onViewClick(item)"
                @onDelete="onDelete(item.id)" />
            </td> -->
            <td>
              <ListMenuWithIcon :menuItems="Options.map(item => ({ ...item, title: $t(`t-${item.title}`) }))"
                @onSelect="onSelect($event, item)" />
            </td>
          </tr>
        </template>
      </Table>

      <div v-if="!filteredData.length" class="text-center pa-7">
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

  <ChangePasswordModal v-if="changePasswordUser" v-model="passwordDialog" :data="changePasswordUser" :error="errorMsg"
    @onSubmit="onSubmitChangePassword" />

  <CreateUpdateUserModal v-if="userData" v-model="dialog" :data="userData" @onSubmit="onSubmit" />

  <ViewUserModal v-if="userData" v-model="viewDialog" :data="userData" />

  <RemoveItemConfirmationDialog v-if="deleteId" v-model="deleteDialog" @onConfirm="onConfirmDelete"
    :loading="deleteLoading" />
</template>
