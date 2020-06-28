export function throwIfAlreayLoaded(ParentModule: any, moduleName: string) {
  if (ParentModule) {
    throw new Error(`${moduleName} has already been loaded.  Import core module in the AppModule only`);
  }
}
