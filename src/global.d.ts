/**
 * Tipos globales para integraciones entre Android (WebView + JSInterface)
 * y la aplicación React.
 *
 * Este archivo es cargado automáticamente por TypeScript.
 * NO debe importarse manualmente en los componentes.
 */

export {};

declare global {
  interface Window {
    /**
     * Bridge que expone métodos de Android hacia la WebApp dentro del WebView.
     * Todos estos métodos provienen de la clase JSInterface.java
     */
    AndroidInterface?: {
      // ✅ MÉTODOS PARA GENERADOR DE LICENCIAS
      onSecureFileSelected?: (data: any) => void;
      onSecureFileError?: (error: string) => void;
      openSecureFilePicker?: () => void;
      generateEncryptedLicense?: (deviceDataJson: string, licensePayloadJson: string) => string;
      exportLicenseToFile?: (licenseData: string) => string;
      
      // ✅ MÉTODOS LEGACY (compatibilidad)
      jsonToPdf?: (inventoryJson: string) => void;
      sendJsonToServer?: (jsonString: string) => void;
      openFileSelector?: () => void;
      getAndroidId?: () => string;
      isPublicKeyReady?: () => boolean;
      getPublicKeyBase64?: () => string;
      decryptLicenseFromWebView?: (payloadJsonBase64: string) => void;
      importAndExtractSecureData?: (base64Data: string) => string;
    };

    /**
     * Callback desde Android → WebView para pasar datos JSON procesados.
     * Usado en tu app de inventario.
     */
    useJsonData?: (jsonString: string) => void;

    /**
     * Callback global ejecutado cuando Android termina de descifrar la licencia.
     * Se utiliza exclusivamente por el verificador premium.
     */
    licenseDecryptionResult?: (decryptedPayload: string) => void;
  }
}