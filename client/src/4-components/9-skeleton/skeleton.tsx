type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
};

export const Skeleton = ({ width = '100%', height = 16, borderRadius = 6, style = {} }: SkeletonProps) => (
  <div style={{ width, height, borderRadius, ...style }} className="skeleton" />
);