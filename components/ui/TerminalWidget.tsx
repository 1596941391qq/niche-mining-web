import React from 'react';

interface TerminalWidgetProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const TerminalWidget: React.FC<TerminalWidgetProps> = ({
  title,
  subtitle,
  children,
  icon,
  className = ""
}) => {
  return (
    <div className={`bg-surface border border-border rounded-sm overflow-hidden flex flex-col group transition-all duration-300 hover:border-emerald-500/30 ${className}`}>
      {/* Widget Header - 终端风格头部 */}
      <div className="flex items-center justify-between px-4 py-2 bg-background border-b border-border">
        <div className="flex items-center gap-2">
          {/* 三色状态灯 */}
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
          </div>
          {/* 模块标题 */}
          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest ml-2">
            sys_module // {title}
          </span>
        </div>
        {/* 可选图标 */}
        {icon && (
          <div className="text-emerald-500/60 group-hover:text-emerald-500 transition-colors">
            {icon}
          </div>
        )}
      </div>

      {/* Widget Content - 内容区域 */}
      <div className="p-4 flex-1 relative">
        {(title || subtitle) && (
          <div className="mb-4">
            <h3 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
              <span className="text-emerald-500 font-mono">/</span> {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-text-tertiary font-mono uppercase mt-1">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>

      {/* Footer Decoration - 底部装饰/进度条动画 */}
      <div className="h-[2px] w-full bg-border relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-0 group-hover:w-full bg-emerald-500 transition-all duration-700 ease-out"></div>
      </div>
    </div>
  );
};

export default TerminalWidget;
