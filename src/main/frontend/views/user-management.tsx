import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button,
  Checkbox,
  Dialog,
  EmailField,
  Grid,
  GridColumn,
  Notification,
  TextField,
} from '@vaadin/react-components';
import { UserService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useGridDataProvider } from '@vaadin/hilla-react-crud';

export const config: ViewConfig = {
  title: 'User Management',
  menu: {
    icon: 'vaadin:users',
    order: 2,
    title: 'User Management',
  },
  loginRequired: true,
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

type UserFormProps = {
  onUserCreated?: () => void;
};

function UserForm(props: UserFormProps) {
  const username = useSignal('');
  const email = useSignal('');
  const firstName = useSignal('');
  const lastName = useSignal('');

  const createUser = async () => {
    try {
      await UserService.createUser(username.value, email.value, firstName.value, lastName.value);
      if (props.onUserCreated) {
        props.onUserCreated();
      }
      username.value = '';
      email.value = '';
      firstName.value = '';
      lastName.value = '';
      Notification.show('User created successfully', {
        duration: 3000,
        position: 'bottom-end',
        theme: 'success',
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <TextField
        placeholder="Username"
        aria-label="Username"
        maxlength={50}
        style={{ minWidth: '15em' }}
        value={username.value}
        onValueChanged={(evt: any) => (username.value = evt.detail.value)}
      />
      <EmailField
        placeholder="Email"
        aria-label="Email"
        maxlength={100}
        style={{ minWidth: '20em' }}
        value={email.value}
        onValueChanged={(evt: any) => (email.value = evt.detail.value)}
      />
      <TextField
        placeholder="First Name"
        aria-label="First Name"
        maxlength={50}
        style={{ minWidth: '12em' }}
        value={firstName.value}
        onValueChanged={(evt: any) => (firstName.value = evt.detail.value)}
      />
      <TextField
        placeholder="Last Name"
        aria-label="Last Name"
        maxlength={50}
        style={{ minWidth: '12em' }}
        value={lastName.value}
        onValueChanged={(evt: any) => (lastName.value = evt.detail.value)}
      />
      <Button onClick={createUser} theme="primary">
        Create User
      </Button>
    </>
  );
}

type EditUserDialogProps = {
  user: any;
  onClose: () => void;
  onUserUpdated: () => void;
};

function EditUserDialog(props: EditUserDialogProps) {
  const email = useSignal(props.user.email);
  const firstName = useSignal(props.user.firstName);
  const lastName = useSignal(props.user.lastName);
  const enabled = useSignal(props.user.enabled);

  const updateUser = async () => {
    try {
      await UserService.updateUser(props.user.id, email.value, firstName.value, lastName.value, enabled.value);
      props.onUserUpdated();
      props.onClose();
      Notification.show('User updated successfully', {
        duration: 3000,
        position: 'bottom-end',
        theme: 'success',
      });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteUser = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.deleteUser(props.user.id);
        props.onUserUpdated();
        props.onClose();
        Notification.show('User deleted successfully', {
          duration: 3000,
          position: 'bottom-end',
          theme: 'success',
        });
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <Dialog opened={true} onOpenedChanged={(e: any) => !e.detail.value && props.onClose()}>
      <div style={{ padding: '1rem', minWidth: '400px' }}>
        <h2>Edit User</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            placeholder="Email"
            value={email.value}
            onValueChanged={(evt: any) => (email.value = evt.detail.value)}
            maxlength={100}
          />
          <TextField
            placeholder="First Name"
            value={firstName.value}
            onValueChanged={(evt: any) => (firstName.value = evt.detail.value)}
            maxlength={50}
          />
          <TextField
            placeholder="Last Name"
            value={lastName.value}
            onValueChanged={(evt: any) => (lastName.value = evt.detail.value)}
            maxlength={50}
          />
          <Checkbox
            label="Enabled"
            checked={enabled.value}
            onCheckedChanged={(evt: any) => (enabled.value = evt.detail.value)}
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button onClick={deleteUser} theme="error">
              Delete
            </Button>
            <Button onClick={updateUser} theme="primary">
              Update
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default function UserManagementView() {
  const dataProvider = useGridDataProvider(UserService.list);
  const selectedUser = useSignal<any>(null);
  const showEditDialog = useSignal(false);

  const handleEditUser = (user: any) => {
    selectedUser.value = user;
    showEditDialog.value = true;
  };

  const handleUserUpdated = () => {
    dataProvider.refresh();
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="User Management">
        <Group>
          <UserForm onUserCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>

      <Grid dataProvider={dataProvider}>
        <GridColumn path="username" header="Username" />
        <GridColumn path="email" header="Email" />
        <GridColumn path="firstName" header="First Name" />
        <GridColumn path="lastName" header="Last Name" />
        <GridColumn path="enabled" header="Enabled">
          {({ item }) => (item.enabled ? 'Yes' : 'No')}
        </GridColumn>
        <GridColumn path="createdDate" header="Created Date">
          {({ item }) => dateTimeFormatter.format(new Date(item.createdDate))}
        </GridColumn>
        <GridColumn path="lastLoginDate" header="Last Login">
          {({ item }) => (item.lastLoginDate ? dateTimeFormatter.format(new Date(item.lastLoginDate)) : 'Never')}
        </GridColumn>
        <GridColumn header="Actions">
          {({ item }) => (
            <Button onClick={() => handleEditUser(item)} theme="primary">
              Edit
            </Button>
          )}
        </GridColumn>
      </Grid>

      {showEditDialog.value && selectedUser.value && (
        <EditUserDialog
          user={selectedUser.value}
          onClose={() => {
            showEditDialog.value = false;
            selectedUser.value = null;
          }}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </main>
  );
}
