import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button,
  Dialog,
  Grid,
  GridColumn,
  Notification,
  TextArea,
  TextField,
  NumberField,
} from '@vaadin/react-components';
import { OrderService, CustomerService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useGridDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Order Management',
  menu: {
    icon: 'vaadin:cart',
    order: 5,
    title: 'Orders',
  },
  loginRequired: true,
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type OrderFormProps = {
  onOrderCreated?: () => void;
  customers: any[];
};

function OrderForm(props: OrderFormProps) {
  const customerId = useSignal<string>('');
  const totalAmount = useSignal<number>(0);
  const shippingAddress = useSignal('');
  const billingAddress = useSignal('');
  const notes = useSignal('');

  const createOrder = async () => {
    try {
      await OrderService.createOrder(
        Number(customerId.value),
        totalAmount.value,
        shippingAddress.value,
        billingAddress.value,
        notes.value
      );
      if (props.onOrderCreated) {
        props.onOrderCreated();
      }
      // Reset form
      customerId.value = '';
      totalAmount.value = 0;
      shippingAddress.value = '';
      billingAddress.value = '';
      notes.value = '';
      Notification.show('Order created successfully', {
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
      <select
        style={{ minWidth: '20em', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        value={customerId.value}
        onChange={(evt: any) => (customerId.value = evt.target.value)}>
        <option value="">Select Customer</option>
        {props.customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.firstName} {customer.lastName} ({customer.email})
          </option>
        ))}
      </select>
      <NumberField
        placeholder="Total Amount"
        aria-label="Total Amount"
        min={0}
        step={0.01}
        style={{ minWidth: '12em' }}
        onValueChanged={(evt: any) => (totalAmount.value = Number(evt.detail.value))}
      />
      <TextArea
        placeholder="Shipping Address"
        aria-label="Shipping Address"
        maxlength={200}
        style={{ minWidth: '25em' }}
        value={shippingAddress.value}
        onValueChanged={(evt: any) => (shippingAddress.value = evt.detail.value)}
        rows={2}
      />
      <Button onClick={createOrder} theme="primary">
        Create Order
      </Button>
    </>
  );
}

type EditOrderDialogProps = {
  order: any;
  customers: any[];
  onClose: () => void;
  onOrderUpdated: () => void;
};

function EditOrderDialog(props: EditOrderDialogProps) {
  const status = useSignal(props.order.status);
  const shippingAddress = useSignal(props.order.shippingAddress || '');
  const billingAddress = useSignal(props.order.billingAddress || '');
  const notes = useSignal(props.order.notes || '');

  const updateOrder = async () => {
    try {
      await OrderService.updateOrder(
        props.order.id,
        status.value,
        shippingAddress.value,
        billingAddress.value,
        notes.value
      );
      props.onOrderUpdated();
      props.onClose();
      Notification.show('Order updated successfully', {
        duration: 3000,
        position: 'bottom-end',
        theme: 'success',
      });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteOrder = async () => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await OrderService.deleteOrder(props.order.id);
        props.onOrderUpdated();
        props.onClose();
        Notification.show('Order deleted successfully', {
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
        <h2>Edit Order</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <strong>Order Number:</strong> {props.order.orderNumber}
          </div>
          <div>
            <strong>Customer:</strong> {props.order.customerName || 'Unknown'}
          </div>
          <div>
            <strong>Total Amount:</strong> {currencyFormatter.format(props.order.totalAmount)}
          </div>
          <select
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            value={status.value}
            onChange={(evt: any) => (status.value = evt.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <TextArea
            placeholder="Shipping Address"
            label="Shipping Address"
            value={shippingAddress.value}
            onValueChanged={(evt: any) => (shippingAddress.value = evt.detail.value)}
            maxlength={200}
            rows={2}
          />
          <TextArea
            placeholder="Billing Address"
            label="Billing Address"
            value={billingAddress.value}
            onValueChanged={(evt: any) => (billingAddress.value = evt.detail.value)}
            maxlength={200}
            rows={2}
          />
          <TextArea
            placeholder="Notes"
            label="Notes"
            value={notes.value}
            onValueChanged={(evt: any) => (notes.value = evt.detail.value)}
            maxlength={500}
            rows={3}
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button onClick={deleteOrder} theme="error">
              Delete
            </Button>
            <Button onClick={updateOrder} theme="primary">
              Update
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default function OrderManagementView() {
  const dataProvider = useGridDataProvider(OrderService.list);
  const selectedOrder = useSignal<any>(null);
  const showEditDialog = useSignal(false);
  const customers = useSignal<any[]>([]);

  const loadCustomers = async () => {
    try {
      const custs = await CustomerService.getActiveCustomers();
      customers.value = custs;
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditOrder = (order: any) => {
    selectedOrder.value = order;
    showEditDialog.value = true;
  };

  const handleOrderUpdated = () => {
    dataProvider.refresh();
  };

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Order Management">
        <Group>
          <OrderForm onOrderCreated={handleOrderUpdated} customers={customers.value} />
        </Group>
      </ViewToolbar>

      <Grid dataProvider={dataProvider}>
        <GridColumn path="orderNumber" header="Order #" />
        <GridColumn path="customerName" header="Customer" />
        <GridColumn path="totalAmount" header="Amount">
          {({ item }) => currencyFormatter.format(item.totalAmount)}
        </GridColumn>
        <GridColumn path="status" header="Status" />
        <GridColumn path="orderDate" header="Order Date">
          {({ item }) => dateTimeFormatter.format(new Date(item.orderDate))}
        </GridColumn>
        <GridColumn path="shippedDate" header="Shipped Date">
          {({ item }) => (item.shippedDate ? dateTimeFormatter.format(new Date(item.shippedDate)) : '-')}
        </GridColumn>
        <GridColumn path="deliveredDate" header="Delivered Date">
          {({ item }) => (item.deliveredDate ? dateTimeFormatter.format(new Date(item.deliveredDate)) : '-')}
        </GridColumn>
        <GridColumn header="Actions">
          {({ item }) => (
            <Button onClick={() => handleEditOrder(item)} theme="primary">
              Edit
            </Button>
          )}
        </GridColumn>
      </Grid>

      {showEditDialog.value && selectedOrder.value && (
        <EditOrderDialog
          order={selectedOrder.value}
          customers={customers.value}
          onClose={() => {
            showEditDialog.value = false;
            selectedOrder.value = null;
          }}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </main>
  );
}
