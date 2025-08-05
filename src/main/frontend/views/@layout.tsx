import { Outlet, useLocation, useNavigate } from 'react-router';
import '@vaadin/icons';
import {
  AppLayout,
  Avatar,
  Icon,
  MenuBar,
  MenuBarItem,
  MenuBarItemSelectedEvent,
  ProgressBar,
  Scroller,
  SideNav,
  SideNavItem,
} from '@vaadin/react-components';
import { Suspense, useMemo } from 'react';
import { createMenuItems } from '@vaadin/hilla-file-router/runtime.js';
import { useAuth } from 'Frontend/security/auth';

function Header() {
  return (
    <div className="flex p-m gap-m items-center" slot="drawer">
      <Icon icon="vaadin:chart" className="text-primary icon-l" />
      <span className="font-semibold text-l">E-commerce Admin</span>
    </div>
  );
}

function MainMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <SideNav className="mx-m" onNavigate={({ path }) => path != null && navigate(path)} location={location}>
      {createMenuItems().map(({ to, icon, title }) => (
        <SideNavItem path={to} key={to}>
          {icon && <Icon icon={icon} slot="prefix" />}
          {title}
        </SideNavItem>
      ))}
    </SideNav>
  );
}

type UserMenuItem = MenuBarItem<{ action?: () => void | Promise<void> }>;

function UserMenu() {
  const { logout, state } = useAuth();

  const fullName = state.user?.fullName;
  const pictureUrl = state.user?.pictureUrl;
  const profileUrl = state.user?.profileUrl;

  const children: Array<UserMenuItem> = useMemo(() => {
    const items: Array<UserMenuItem> = [];
    if (profileUrl) {
      items.push({ text: 'View Profile', action: () => window.open(profileUrl, 'blank')?.focus() });
    }
    items.push({ text: 'Logout', action: logout });
    return items;
  }, [profileUrl, logout]);

  if (!state.user) {
    return null;
  }

  const items: Array<UserMenuItem> = [
    {
      component: (
        <>
          <Avatar theme="xsmall" img={pictureUrl} name={fullName} colorIndex={5} className="mr-s" /> {fullName}
        </>
      ),
      children: children,
    },
  ];
  const onItemSelected = (event: MenuBarItemSelectedEvent<UserMenuItem>) => {
    event.detail.value.action?.();
  };
  return (
    <MenuBar theme="tertiary-inline" items={items} onItemSelected={onItemSelected} className="m-m" slot="drawer" />
  );
}

export default function MainLayout() {
  return (
    <AppLayout primarySection="drawer">
      <Header />
      <Scroller slot="drawer">
        <MainMenu />
      </Scroller>
      <UserMenu />
      <Suspense fallback={<ProgressBar indeterminate={true} className="m-0" />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}
