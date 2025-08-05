import { OrderService, ProductService, CustomerService } from 'Frontend/generated/endpoints';
import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Card, Grid, GridColumn, HorizontalLayout, VerticalLayout } from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect } from 'react';
import handleError from 'Frontend/views/_ErrorHandler';

export const config: ViewConfig = {
  title: 'E-commerce Dashboard',
  menu: {
    icon: 'vaadin:chart',
    order: 1,
    title: 'Dashboard',
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

export default function EcommerceDashboardView() {
  const totalRevenue = useSignal<number>(0);
  const pendingOrders = useSignal<number>(0);
  const totalProducts = useSignal<number>(0);
  const totalCustomers = useSignal<number>(0);
  const recentOrders = useSignal<any[]>([]);
  const lowStockProducts = useSignal<any[]>([]);
  const loading = useSignal(true);

  const loadDashboardData = async () => {
    try {
      loading.value = true;

      // Load analytics data
      const [revenue, pendingCount, products, customers] = await Promise.all([
        OrderService.getTotalRevenue(),
        OrderService.getOrderCountByStatus('PENDING'),
        ProductService.list({ pageNumber: 0, pageSize: 1000, sort: { orders: [] } }),
        CustomerService.list({ pageNumber: 0, pageSize: 1000, sort: { orders: [] } }),
      ]);

      totalRevenue.value = Number(revenue);
      pendingOrders.value = pendingCount;
      totalProducts.value = products.length;
      totalCustomers.value = customers.length;

      // Load recent orders
      const orders = await OrderService.list({ pageNumber: 0, pageSize: 5, sort: { orders: [] } });
      recentOrders.value = orders;

      // Load low stock products
      const lowStock = await ProductService.getLowStockProducts(10);
      lowStockProducts.value = lowStock;
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <VerticalLayout style={{ gap: '1rem' }}>
        <h1>E-commerce Dashboard</h1>

        {/* Analytics Cards */}
        <HorizontalLayout style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <Card style={{ minWidth: '200px', flex: '1' }}>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Revenue</h3>
              <h2 style={{ margin: '0', color: '#2e7d32' }}>{currencyFormatter.format(totalRevenue.value)}</h2>
            </div>
          </Card>

          <Card style={{ minWidth: '200px', flex: '1' }}>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Pending Orders</h3>
              <h2 style={{ margin: '0', color: '#f57c00' }}>{pendingOrders.value}</h2>
            </div>
          </Card>

          <Card style={{ minWidth: '200px', flex: '1' }}>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Products</h3>
              <h2 style={{ margin: '0', color: '#1976d2' }}>{totalProducts.value}</h2>
            </div>
          </Card>

          <Card style={{ minWidth: '200px', flex: '1' }}>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Total Customers</h3>
              <h2 style={{ margin: '0', color: '#7b1fa2' }}>{totalCustomers.value}</h2>
            </div>
          </Card>
        </HorizontalLayout>

        {/* Recent Orders */}
        <Card>
          <div style={{ padding: '1rem' }}>
            <h3>Recent Orders</h3>
            <Grid items={recentOrders.value}>
              <GridColumn path="orderNumber" header="Order #" />
              <GridColumn path="totalAmount" header="Amount">
                {({ item }) => currencyFormatter.format(item.totalAmount)}
              </GridColumn>
              <GridColumn path="status" header="Status" />
              <GridColumn path="orderDate" header="Order Date">
                {({ item }) => dateTimeFormatter.format(new Date(item.orderDate))}
              </GridColumn>
            </Grid>
          </div>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <div style={{ padding: '1rem' }}>
            <h3>Low Stock Products</h3>
            <Grid items={lowStockProducts.value}>
              <GridColumn path="name" header="Product" />
              <GridColumn path="sku" header="SKU" />
              <GridColumn path="stockQuantity" header="Stock" />
              <GridColumn path="price" header="Price">
                {({ item }) => currencyFormatter.format(item.price)}
              </GridColumn>
            </Grid>
          </div>
        </Card>
      </VerticalLayout>
    </main>
  );
}
