import React, { FC } from 'react';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { AppRoutes } from './routes';

const App: FC = () => (
  <div className={styles.app}>
    <AppHeader />
    <main className={styles.content}>
      <AppRoutes />
    </main>
  </div>
);

export default App;
