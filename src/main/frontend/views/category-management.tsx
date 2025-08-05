import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button,
  Checkbox,
  Dialog,
  Grid,
  GridColumn,
  Notification,
  TextArea,
  TextField,
} from '@vaadin/react-components';
import { CategoryService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useGridDataProvider } from '@vaadin/hilla-react-crud';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Category Management',
  menu: {
    icon: 'vaadin:folder',
    order: 4,
    title: 'Categories',
  },
  loginRequired: true,
};

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'medium',
});

type CategoryFormProps = {
  onCategoryCreated?: () => void;
  categories: any[];
};

function CategoryForm(props: CategoryFormProps) {
  const name = useSignal('');
  const description = useSignal('');
  const parentCategoryId = useSignal<string>('');

  const createCategory = async () => {
    try {
      await CategoryService.createCategory(
        name.value,
        description.value,
        parentCategoryId.value ? Number(parentCategoryId.value) : undefined
      );
      if (props.onCategoryCreated) {
        props.onCategoryCreated();
      }
      name.value = '';
      description.value = '';
      parentCategoryId.value = '';
      Notification.show('Category created successfully', {
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
        placeholder="Category Name"
        aria-label="Category Name"
        maxlength={100}
        style={{ minWidth: '20em' }}
        value={name.value}
        onValueChanged={(evt: any) => (name.value = evt.detail.value)}
      />
      <TextArea
        placeholder="Description"
        aria-label="Description"
        maxlength={500}
        style={{ minWidth: '25em' }}
        value={description.value}
        onValueChanged={(evt: any) => (description.value = evt.detail.value)}
        rows={2}
      />
      <select
        style={{ minWidth: '15em', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        value={parentCategoryId.value}
        onChange={(evt: any) => (parentCategoryId.value = evt.target.value)}>
        <option value="">No Parent</option>
        {props.categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <Button onClick={createCategory} theme="primary">
        Create Category
      </Button>
    </>
  );
}

type EditCategoryDialogProps = {
  category: any;
  categories: any[];
  onClose: () => void;
  onCategoryUpdated: () => void;
};

function EditCategoryDialog(props: EditCategoryDialogProps) {
  const name = useSignal(props.category.name);
  const description = useSignal(props.category.description || '');
  const parentCategoryId = useSignal(props.category.parentCategoryId?.toString() || '');
  const active = useSignal(props.category.active);

  const updateCategory = async () => {
    try {
      await CategoryService.updateCategory(
        props.category.id,
        name.value,
        description.value,
        parentCategoryId.value ? Number(parentCategoryId.value) : undefined,
        active.value
      );
      props.onCategoryUpdated();
      props.onClose();
      Notification.show('Category updated successfully', {
        duration: 3000,
        position: 'bottom-end',
        theme: 'success',
      });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteCategory = async () => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await CategoryService.deleteCategory(props.category.id);
        props.onCategoryUpdated();
        props.onClose();
        Notification.show('Category deleted successfully', {
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
        <h2>Edit Category</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <TextField
            placeholder="Category Name"
            label="Category Name"
            value={name.value}
            onValueChanged={(evt: any) => (name.value = evt.detail.value)}
            maxlength={100}
          />
          <TextArea
            placeholder="Description"
            label="Description"
            value={description.value}
            onValueChanged={(evt: any) => (description.value = evt.detail.value)}
            maxlength={500}
            rows={3}
          />
          <select
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            value={parentCategoryId.value}
            onChange={(evt: any) => (parentCategoryId.value = evt.target.value)}>
            <option value="">No Parent</option>
            {props.categories
              .filter((cat) => cat.id !== props.category.id) // Exclude self from parent options
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
          <Checkbox
            label="Active"
            checked={active.value}
            onCheckedChanged={(evt: any) => (active.value = evt.detail.value)}
          />
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button onClick={deleteCategory} theme="error">
              Delete
            </Button>
            <Button onClick={updateCategory} theme="primary">
              Update
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default function CategoryManagementView() {
  const dataProvider = useGridDataProvider(CategoryService.list);
  const selectedCategory = useSignal<any>(null);
  const showEditDialog = useSignal(false);
  const categories = useSignal<any[]>([]);

  const loadCategories = async () => {
    try {
      const cats = await CategoryService.getActiveCategories();
      categories.value = cats;
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditCategory = (category: any) => {
    selectedCategory.value = category;
    showEditDialog.value = true;
  };

  const handleCategoryUpdated = () => {
    dataProvider.refresh();
    loadCategories(); // Reload categories for the form
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Category Management">
        <Group>
          <CategoryForm onCategoryCreated={handleCategoryUpdated} categories={categories.value} />
        </Group>
      </ViewToolbar>

      <Grid dataProvider={dataProvider}>
        <GridColumn path="name" header="Category Name" />
        <GridColumn path="description" header="Description" />
        <GridColumn path="parentCategoryId" header="Parent Category">
          {({ item }) => {
            if (!item.parentCategoryId) return 'None';
            const parent = categories.value.find((cat) => cat.id === item.parentCategoryId);
            return parent ? parent.name : 'Unknown';
          }}
        </GridColumn>
        <GridColumn path="active" header="Active">
          {({ item }) => (item.active ? 'Yes' : 'No')}
        </GridColumn>
        <GridColumn path="createdDate" header="Created Date">
          {({ item }) => dateTimeFormatter.format(new Date(item.createdDate))}
        </GridColumn>
        <GridColumn header="Actions">
          {({ item }) => (
            <Button onClick={() => handleEditCategory(item)} theme="primary">
              Edit
            </Button>
          )}
        </GridColumn>
      </Grid>

      {showEditDialog.value && selectedCategory.value && (
        <EditCategoryDialog
          category={selectedCategory.value}
          categories={categories.value}
          onClose={() => {
            showEditDialog.value = false;
            selectedCategory.value = null;
          }}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}
    </main>
  );
}
