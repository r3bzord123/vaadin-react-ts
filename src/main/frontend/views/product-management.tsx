import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button,
  Checkbox,
  Dialog,
  Grid,
  GridColumn,
  Notification,
  NumberField,
  TextArea,
  TextField,
} from '@vaadin/react-components';
import { ProductService, CategoryService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useGridDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Product Management',
  menu: {
    icon: 'vaadin:package',
    order: 2,
    title: 'Products',
  },
  loginRequired: true,
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

type ProductFormProps = {
  onProductCreated?: () => void;
  categories: any[];
};

function ProductForm(props: ProductFormProps) {
  const name = useSignal('');
  const description = useSignal('');
  const sku = useSignal('');
  const price = useSignal<number>(0);
  const stockQuantity = useSignal<number>(0);
  const categoryId = useSignal<string>('');
  const imageUrl = useSignal('');

  const createProduct = async () => {
    try {
      await ProductService.createProduct(
        name.value,
        description.value,
        sku.value,
        price.value,
        stockQuantity.value,
        categoryId.value ? Number(categoryId.value) : undefined,
        imageUrl.value
      );
      if (props.onProductCreated) {
        props.onProductCreated();
      }
      name.value = '';
      description.value = '';
      sku.value = '';
      price.value = 0;
      stockQuantity.value = 0;
      categoryId.value = '';
      imageUrl.value = '';
      Notification.show('Product created successfully', {
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
        placeholder="Product Name"
        aria-label="Product Name"
        maxlength={200}
        style={{ minWidth: '20em' }}
        value={name.value}
        onValueChanged={(evt) => (name.value = evt.detail.value)}
      />
      <TextField
        placeholder="SKU"
        aria-label="SKU"
        maxlength={50}
        style={{ minWidth: '15em' }}
        value={sku.value}
        onValueChanged={(evt) => (sku.value = evt.detail.value)}
      />
      <NumberField
        placeholder="Price"
        aria-label="Price"
        min={0}
        step={0.01}
        style={{ minWidth: '12em' }}
        onValueChanged={(evt) => (price.value = Number(evt.detail.value))}
      />
      <NumberField
        placeholder="Stock Quantity"
        aria-label="Stock Quantity"
        min={0}
        style={{ minWidth: '12em' }}
        onValueChanged={(evt) => (stockQuantity.value = Number(evt.detail.value))}
      />
      <select
        style={{ minWidth: '15em', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        value={categoryId.value}
        onChange={(evt) => (categoryId.value = evt.target.value)}>
        <option value="">No Category</option>
        {Array.isArray(props.categories) &&
          props.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </select>

      <Button onClick={createProduct} theme="primary">
        Create Product
      </Button>
    </>
  );
}

type EditProductDialogProps = {
  product: any;
  categories: any[];
  onClose: () => void;
  onProductUpdated: () => void;
};

function EditProductDialog(props: EditProductDialogProps) {
  const name = useSignal(props.product.name);
  const description = useSignal(props.product.description);
  const sku = useSignal(props.product.sku);
  const price = useSignal(props.product.price);
  const stockQuantity = useSignal(props.product.stockQuantity);
  const categoryId = useSignal(props.product.categoryId?.toString() || '');
  const imageUrl = useSignal(props.product.imageUrl || '');
  const active = useSignal(props.product.active);

  const updateProduct = async () => {
    try {
      await ProductService.updateProduct(
        props.product.id,
        name.value,
        description.value,
        sku.value,
        price.value,
        stockQuantity.value,
        categoryId.value ? Number(categoryId.value) : undefined,
        imageUrl.value,
        active.value
      );
      props.onProductUpdated();
      props.onClose();
      Notification.show('Product updated successfully', {
        duration: 3000,
        position: 'bottom-end',
        theme: 'success',
      });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteProduct = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(props.product.id);
        props.onProductUpdated();
        props.onClose();
        Notification.show('Product deleted successfully', {
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
    <Dialog opened={true} onOpenedChanged={(e) => !e.detail.value && props.onClose()}>
      <div style={{ padding: '1rem', minWidth: '500px' }}>
        <h2>Edit Product</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            placeholder="Product Name"
            aria-label="Product Name"
            label="Product Name"
            value={name.value}
            onValueChanged={(evt) => (name.value = evt.detail.value)}
            maxlength={200}
          />
          <TextArea
            placeholder="Description"
            aria-label="Description"
            label="Description"
            value={description.value}
            onValueChanged={(evt) => (description.value = evt.detail.value)}
            maxlength={1000}
            rows={3}
          />
          <TextField
            placeholder="SKU"
            label="SKU"
            value={sku.value}
            onValueChanged={(evt) => (sku.value = evt.detail.value)}
            maxlength={50}
          />
          <NumberField
            placeholder="Price"
            label="Price"
            value={price.value}
            onValueChanged={(evt) => (price.value = Number(evt.detail.value))}
            min={0}
            step={0.01}
          />
          <NumberField
            placeholder="Stock Quantity"
            label="Stock Quantity"
            value={stockQuantity.value}
            onValueChanged={(evt) => (stockQuantity.value = Number(evt.detail.value))}
            min={0}
          />
          <select
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            value={categoryId.value}
            onChange={(evt) => (categoryId.value = evt.target.value)}>
            <option value="">No Category</option>
            {Array.isArray(props.categories) &&
              props.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
          <TextField
            placeholder="Image URL"
            label="Image URL"
            value={imageUrl.value}
            onValueChanged={(evt) => (imageUrl.value = evt.detail.value)}
          />
          <Checkbox
            label="Active"
            checked={active.value}
            onCheckedChanged={(evt) => (active.value = evt.detail.value)}
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button onClick={deleteProduct} theme="error">
              Delete
            </Button>
            <Button onClick={updateProduct} theme="primary">
              Update
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default function ProductManagementView() {
  const dataProvider = useGridDataProvider(ProductService.list);
  const selectedProduct = useSignal<any>(null);
  const showEditDialog = useSignal(false);
  const categories = useSignal<any[]>([]);

  const loadCategories = async () => {
    try {
      const cats = await CategoryService.getActiveCategories();
      categories.value = cats || [];
    } catch (error) {
      handleError(error);
      categories.value = [];
    }
  };

  const handleEditProduct = (product: any) => {
    selectedProduct.value = product;
    showEditDialog.value = true;
  };

  const handleProductUpdated = () => {
    dataProvider.refresh();
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Product Management">
        <Group>
          <ProductForm onProductCreated={dataProvider.refresh} categories={categories.value || []} />
        </Group>
      </ViewToolbar>

      <Grid dataProvider={dataProvider}>
        <GridColumn path="name" header="Product Name" />
        <GridColumn path="sku" header="SKU" />
        <GridColumn path="price" header="Price">
          {({ item }) => currencyFormatter.format(item.price)}
        </GridColumn>
        <GridColumn path="stockQuantity" header="Stock" />
        <GridColumn path="active" header="Active">
          {({ item }) => (item.active ? 'Yes' : 'No')}
        </GridColumn>
        <GridColumn path="createdDate" header="Created Date">
          {({ item }) => dateTimeFormatter.format(new Date(item.createdDate))}
        </GridColumn>
        <GridColumn header="Actions">
          {({ item }) => (
            <Button onClick={() => handleEditProduct(item)} theme="primary">
              Edit
            </Button>
          )}
        </GridColumn>
      </Grid>

      {showEditDialog.value && selectedProduct.value && (
        <EditProductDialog
          product={selectedProduct.value}
          categories={categories.value}
          onClose={() => {
            showEditDialog.value = false;
            selectedProduct.value = null;
          }}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </main>
  );
}
