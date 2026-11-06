import {validBuildEvidence,validAcceptanceEvidence} from './evidence.mjs';

// These are V3 exit requirements, independent of a successful platform compile.
export const requiredV3Gates = Object.freeze([
 'runtime-adapter', 'platform-interactions', 'clean-host-plugin',
 'independent-evaluation', 'accessibility-performance', 'recovery-integration',
 'distribution-upgrade-rollback'
]);

export function assessStability(root,platforms,buildEvidence,workflowEvidence,digest) {
 const pendingPlatforms=platforms.filter(platform=>!buildEvidence?.platforms?.some(row=>
  row.platform===platform&&row.build==='passed'&&validBuildEvidence(root,platform,row.evidence,digest)));
 const pendingV3Gates=requiredV3Gates.filter(gate=>!workflowEvidence?.gates?.some(row=>
  row.gate===gate&&row.status==='passed'&&validAcceptanceEvidence(root,gate,row.evidence,digest)));
 return {stableReady:pendingPlatforms.length===0&&pendingV3Gates.length===0,pendingPlatforms,pendingV3Gates};
}
