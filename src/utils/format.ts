export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getMapBadgeColor(mapType: string): { bg: string; text: string; border: string } {
  switch (mapType) {
    case 'basecolor':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'normal':
      return { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'roughness':
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'metallic':
      return { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'height':
      return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' };
    case 'refraction':
      return { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30' };
    case 'ambientOcclusion':
      return { bg: 'bg-stone-500/15', text: 'text-stone-400', border: 'border-stone-500/30' };
    default:
      return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' };
  }
}

export function getMapShortLabel(mapType: string): string {
  switch (mapType) {
    case 'basecolor': return 'ALB';
    case 'normal': return 'NRM';
    case 'roughness': return 'RGH';
    case 'metallic': return 'MET';
    case 'height': return 'HGT';
    case 'refraction': return 'RFR';
    case 'ambientOcclusion': return 'AO';
    default: return mapType.toUpperCase().slice(0, 3);
  }
}
