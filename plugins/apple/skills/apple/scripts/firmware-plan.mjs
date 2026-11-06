import {inspectIPSW} from './apple.mjs';
import {hashFile} from './workbench.mjs';

// An offline preflight produces evidence, never a hardware command.
export async function firmwarePlan({file,sha256,productType,ecid}) {
 if(!/^iPhone\d+,\d+$|^iPad\d+,\d+$|^AppleTV\d+,\d+$/.test(productType??''))throw Error('Exact supported product type required');
 if(!/^[a-f0-9]{1,32}$/i.test(ecid??''))throw Error('Exact hexadecimal device ECID required');
 if(!/^[a-f0-9]{64}$/i.test(sha256??''))throw Error('Expected SHA-256 required');
 const archive=inspectIPSW(file);
 const integrity=await hashFile(file,sha256);
 if(!integrity.matches)throw Error('Firmware checksum mismatch');
 const manifests=['BuildManifest.plist','Restore.plist'];
 if(!manifests.every(m=>archive.entries.includes(m)))throw Error('Required restore manifests missing');
 return {mode:'offline-preflight',target:{productType,ecid},integrity,archiveDirectoryChecked:true,manifestCompatibility:'not checked',signingStatus:'not checked',restoreReady:false,required:['Parse and match SupportedProductTypes and BuildIdentities','Check current Apple personalization for exact device/build','Confirm backup and intended operation'],hardwareActions:[]};
}
