export default interface KayentaCredential {
  name: string;
  supportedTypes: string[];
  objects: any;
  metadata: any;
  type: string;
  recommendedLocations: string[];
  locations: string[];
}
