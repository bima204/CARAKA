declare module 'carakanjs' {
  export function toJavanese(
    input: string,
    options?: {
      useSwara?: boolean;
      useMurda?: boolean;
    }
  ): string;
}

