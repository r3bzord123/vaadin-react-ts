// TODO Replace with your own main view.

import { ViewConfig } from '@vaadin/hilla-file-router/types.js';

export const config: ViewConfig = {
  menu: {
    exclude: true,
  },
  loginRequired: true,
};

export default function MainView() {
  return <main className="p-m">Please select a view from the menu on the left.</main>;
}
