// MODULES
import { useState } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore } from '../../context';

// COMPONENT
import Input from '../Input';
import Button from '../Button';

// UTILS
import createPromotionEmail from '../../utils/createPromotionEmail';

// STYLES
import styles from './EmailSubscription.module.scss';

function EmailSubscription() {
  const store = useStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className={cn(styles['container'], 'trnstn', 'flx-ctr-ctr')}>
      <div className={cn(styles['email-subscription'], 'flx-ctr-ctr')}>
        <div className={cn(styles['left'], 'trnstn')}>
          <div className={cn(styles['title'], 'trnstn')}>
            <span>Be the first to know about </span>
            <span>Crypto news everyday</span>
          </div>
          <div className={cn(styles['subtitle'], 'trnstn')}>
            Get crypto analysis, news and updates right to your inbox! Sign up
            here so dont miss a single newsletter
          </div>

          <div className={cn(styles['subscription'], 'flx-str-ctr', 'trnstn')}>
            <Input
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Button
              primary
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await createPromotionEmail(email, store);
                setLoading(false);
              }}
              title="Subscribe now"
            />
          </div>
        </div>
        <div className={cn(styles['right'], 'trnstn')}></div>
      </div>
    </div>
  );
}

export default EmailSubscription;
