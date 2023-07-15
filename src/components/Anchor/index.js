function Anchor({
  href = '#',
  ref,
  rel,
  target,
  content = '',
  className = '',
  onClick = () => {},
  children,
}) {
  return (
    <a
      className={className}
      href={href}
      rel={rel}
      target={target}
      onClick={onClick}
      ref={ref}
    >
      {content || children}
    </a>
  );
}

export default Anchor;
