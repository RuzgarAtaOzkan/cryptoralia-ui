// MODULES
import Link from 'next/link';

function LinkTag({ href = '#', children }) {
  return (
    <Link href={href}>
      <a>{children}</a>
    </Link>
  );
}

export default LinkTag;
