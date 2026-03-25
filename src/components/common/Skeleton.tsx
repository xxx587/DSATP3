import React from 'react';

interface SkeletonProps {
  className?: string;
}

/**
 * @description 로딩 상태를 표시하기 위한 스켈레톤 컴포넌트
 * @param {SkeletonProps} props - 컴포넌트 Props
 * @return {TSX.Element} 애니메이션이 포함된 스켈레톤 UI
 */
const Skeleton = ({ className = '' }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-zinc-800/30 border border-zinc-800/10 ${className}`}
    />
  );
};

export default Skeleton;
