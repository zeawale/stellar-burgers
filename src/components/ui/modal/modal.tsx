import { FC, memo } from 'react';
import styles from './modal.module.css';
import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

import {
  MODAL_SELECTOR,
  MODAL_TITLE_SELECTOR,
  MODAL_CLOSE_SELECTOR
} from './modal.selectors';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => (
    <>
      <div className={styles.modal} data-cy={MODAL_SELECTOR}>
        <div className={styles.header}>
          <h3
            className={`${styles.title} text text_type_main-large`}
            data-cy={MODAL_TITLE_SELECTOR}
          >
            {title}
          </h3>

          <button
            className={styles.button}
            type='button'
            data-cy={MODAL_CLOSE_SELECTOR}
            onClick={onClose}
          >
            <CloseIcon type='primary' />
          </button>
        </div>

        <div className={styles.content}>{children}</div>
      </div>

      <ModalOverlayUI onClick={onClose} />
    </>
  )
);
