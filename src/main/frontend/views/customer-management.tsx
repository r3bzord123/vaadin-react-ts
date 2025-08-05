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
  TextArea,
} from '@vaadin/react-components';
import { CustomerService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useGridDataProvider } from '@vaadin/hilla-react-crud';

export const config: ViewConfig = {
  title: 'Customer Management',
  menu: {
    icon: 'vaadin:users',
    order: 3,
    title: 'Customers',
  },
  loginRequired: true,
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

type CustomerFormProps = {
  onCustomerCreated?: () => void;
};

function CustomerForm(props: CustomerFormProps) {
  const firstName = useSignal('');
  const lastName = useSignal('');
  const email = useSignal('');
  const phone = useSignal('');
  const address = useSignal('');
  const city = useSignal('');
  const state = useSignal('');
  const postalCode = useSignal('');
  const country = useSignal('');

  const createCustomer = async () => {
    try {
      await CustomerService.createCustomer(
        firstName.value,
        lastName.value,
        email.value,
        phone.value,
        address.value,
        city.value,
        state.value,
        postalCode.value,
        country.value
      );
      if (props.onCustomerCreated) {
        props.onCustomerCreated();
      }
      // Reset form
      firstName.value = '';
      lastName.value = '';
      email.value = '';
      phone.value = '';
      address.value = '';
      city.value = '';
      state.value = '';
      postalCode.value = '';
      country.value = '';
      Notification.show('Customer created successfully', {
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
      <EmailField
        placeholder="Email"
        aria-label="Email"
        maxlength={100}
        style={{ minWidth: '20em' }}
        value={email.value}
        onValueChanged={(evt: any) => (email.value = evt.detail.value)}
      />
      <TextField
        placeholder="Phone"
        aria-label="Phone"
        maxlength={20}
        style={{ minWidth: '12em' }}
        value={phone.value}
        onValueChanged={(evt: any) => (phone.value = evt.detail.value)}
      />
      <Button onClick={createCustomer} theme="primary">
        Create Customer
      </Button>
    </>
  );
}

type EditCustomerDialogProps = {
  customer: any;
  onClose: () => void;
  onCustomerUpdated: () => void;
};

function EditCustomerDialog(props: EditCustomerDialogProps) {
  const firstName = useSignal(props.customer.firstName);
  const lastName = useSignal(props.customer.lastName);
  const email = useSignal(props.customer.email);
  const phone = useSignal(props.customer.phone || '');
  const address = useSignal(props.customer.address || '');
  const city = useSignal(props.customer.city || '');
  const state = useSignal(props.customer.state || '');
  const postalCode = useSignal(props.customer.postalCode || '');
  const country = useSignal(props.customer.country || '');
  const active = useSignal(props.customer.active);

  const updateCustomer = async () => {
    try {
      await CustomerService.updateCustomer(
        props.customer.id,
        firstName.value,
        lastName.value,
        email.value,
        phone.value,
        address.value,
        city.value,
        state.value,
        postalCode.value,
        country.value,
        active.value
      );
      props.onCustomerUpdated();
      props.onClose();
      Notification.show('Customer updated successfully', {
        duration: 3000,
        position: 'bottom-end',
        theme: 'success',
      });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteCustomer = async () => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await CustomerService.deleteCustomer(props.customer.id);
        props.onCustomerUpdated();
        props.onClose();
        Notification.show('Customer deleted successfully', {
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
      <div style={{ padding: '1rem', minWidth: '500px' }}>
        <h2>Edit Customer</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            placeholder="First Name"
            label="First Name"
            value={firstName.value}
            onValueChanged={(evt: any) => (firstName.value = evt.detail.value)}
            maxlength={50}
          />
          <TextField
            placeholder="Last Name"
            label="Last Name"
            value={lastName.value}
            onValueChanged={(evt: any) => (lastName.value = evt.detail.value)}
            maxlength={50}
          />
          <EmailField
            placeholder="Email"
            label="Email"
            value={email.value}
            onValueChanged={(evt: any) => (email.value = evt.detail.value)}
            maxlength={100}
          />
          <TextField
            placeholder="Phone"
            label="Phone"
            value={phone.value}
            onValueChanged={(evt: any) => (phone.value = evt.detail.value)}
            maxlength={20}
          />
          <TextArea
            placeholder="Address"
            label="Address"
            value={address.value}
            onValueChanged={(evt: any) => (address.value = evt.detail.value)}
            maxlength={200}
            rows={2}
          />
          <TextField
            placeholder="City"
            label="City"
            value={city.value}
            onValueChanged={(evt: any) => (city.value = evt.detail.value)}
            maxlength={50}
          />
          <TextField
            placeholder="State"
            label="State"
            value={state.value}
            onValueChanged={(evt: any) => (state.value = evt.detail.value)}
            maxlength={50}
          />
          <TextField
            placeholder="Postal Code"
            label="Postal Code"
            value={postalCode.value}
            onValueChanged={(evt: any) => (postalCode.value = evt.detail.value)}
            maxlength={20}
          />
          <TextField
            placeholder="Country"
            label="Country"
            value={country.value}
            onValueChanged={(evt: any) => (country.value = evt.detail.value)}
            maxlength={50}
          />
          <Checkbox
            label="Active"
            checked={active.value}
            onCheckedChanged={(evt: any) => (active.value = evt.detail.value)}
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button onClick={deleteCustomer} theme="error">
              Delete
            </Button>
            <Button onClick={updateCustomer} theme="primary">
              Update
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default function CustomerManagementView() {
  const dataProvider = useGridDataProvider(CustomerService.list);
  const selectedCustomer = useSignal<any>(null);
  const showEditDialog = useSignal(false);

  const handleEditCustomer = (customer: any) => {
    selectedCustomer.value = customer;
    showEditDialog.value = true;
  };

  const handleCustomerUpdated = () => {
    dataProvider.refresh();
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Customer Management">
        <Group>
          <CustomerForm onCustomerCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>

      <Grid dataProvider={dataProvider}>
        <GridColumn path="firstName" header="First Name" />
        <GridColumn path="lastName" header="Last Name" />
        <GridColumn path="email" header="Email" />
        <GridColumn path="phone" header="Phone" />
        <GridColumn path="city" header="City" />
        <GridColumn path="state" header="State" />
        <GridColumn path="active" header="Active">
          {({ item }) => (item.active ? 'Yes' : 'No')}
        </GridColumn>
        <GridColumn path="createdDate" header="Created Date">
          {({ item }) => dateTimeFormatter.format(new Date(item.createdDate))}
        </GridColumn>
        <GridColumn header="Actions">
          {({ item }) => (
            <Button onClick={() => handleEditCustomer(item)} theme="primary">
              Edit
            </Button>
          )}
        </GridColumn>
      </Grid>

      {showEditDialog.value && selectedCustomer.value && (
        <EditCustomerDialog
          customer={selectedCustomer.value}
          onClose={() => {
            showEditDialog.value = false;
            selectedCustomer.value = null;
          }}
          onCustomerUpdated={handleCustomerUpdated}
        />
      )}
    </main>
  );
}
