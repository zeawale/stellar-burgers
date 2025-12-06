import styles from './modal-overlay.module.css';
import { MODAL_OVERLAY_SELECTOR } from '../modal/modal.selectors';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    className={styles.overlay}
    data-cy={MODAL_OVERLAY_SELECTOR}
    role='button'
    tabIndex={0}
    onClick={onClick}
  />
);
