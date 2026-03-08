import React, { useEffect, useState, useCallback } from "react";

interface ScreenAdapterProps {
  /** 设计稿宽度，默认 1920 */
  designWidth?: number;
  /** 设计稿高度，默认 1080 */
  designHeight?: number;
  /** 外层自定义 className（例如结合 tailwind-merge / clsx 使用） */
  className?: string;
  children: React.ReactNode;
}

/**
 * 全屏自适应容器，按设计稿尺寸（默认 1920x1080）进行等比例缩放并居中显示。
 * 使用方式：
 *
 * <ScreenAdapter>
 *   <YourBigScreenLayout />
 * </ScreenAdapter>
 */
const ScreenAdapter: React.FC<ScreenAdapterProps> = ({
  designWidth = 1920,
  designHeight = 1080,
  className,
  children,
}) => {
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    if (typeof window === "undefined") return;

    const { innerWidth, innerHeight } = window;
    const scaleX = innerWidth / designWidth;
    const scaleY = innerHeight / designHeight;
    const finalScale = Math.min(scaleX, scaleY);

    setScale(finalScale);
  }, [designWidth, designHeight]);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000", // 可以根据需要修改背景
      }}
    >
      <div
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScreenAdapter;

