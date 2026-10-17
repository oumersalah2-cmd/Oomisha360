declare module "next" {
  export interface Metadata {
    title?: string | { default: string; template: string };
    description?: string;
    icons?: any;
    keywords?: string[];
    [key: string]: any;
  }
  export type NextConfig = Record<string, any>;
}

declare module "next/link" {
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string | any;
    replace?: boolean;
    scroll?: boolean;
    prefetch?: boolean;
    children?: React.ReactNode;
    className?: string;
  }
  const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
  export default Link;
}

declare module "next/navigation" {
  export interface AppRouterInstance {
    back(): void;
    forward(): void;
    refresh(): void;
    push(href: string, options?: any): void;
    replace(href: string, options?: any): void;
    prefetch(href: string, options?: any): void;
  }
  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useParams(): Record<string, string | string[]>;
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare module "next/dynamic" {
  export default function dynamic<P = {}>(
    dynamicOptions: () => Promise<React.ComponentType<P> | { default: React.ComponentType<P> }>,
    options?: {
      ssr?: boolean;
      loading?: () => React.ReactElement | null;
    }
  ): React.ComponentType<P>;
}

declare module "next/font/google" {
  export interface FontOptions {
    subsets?: string[];
    weight?: string | string[];
    display?: string;
    variable?: string;
  }
  export function Inter(options?: FontOptions): { className: string; variable: string };
}

declare module "next/headers" {
  export function cookies(): Promise<any> | any;
  export function headers(): Promise<any> | any;
}
