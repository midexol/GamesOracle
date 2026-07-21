// Allow CSS file imports in TypeScript (processed by Parcel, not tsc)
declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}
