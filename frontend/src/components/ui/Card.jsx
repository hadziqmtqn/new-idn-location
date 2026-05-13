import React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const Card = ({ children, className }) => (
  <div className={cn("rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md", className)}>{children}</div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn("text-lg font-bold leading-none tracking-tight", className)}>{children}</h3>
);

export const CardDescription = ({ children, className }) => (
  <p className={cn("text-xs text-muted-foreground", className)}>{children}</p>
);

export const CardContent = ({ children, className }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);
