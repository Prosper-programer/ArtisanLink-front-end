import { Professional } from '@/data/mockData';
import { UserProfile } from '@/context/AppContext';

export function getCanonicalTrade(input?: string): string {
  if (!input) return '';
  const s = input.toLowerCase();

  if (
    s.includes('plumb') ||
    s.includes('plomb') ||
    s.includes('pipe') ||
    s.includes('tuyau') ||
    s.includes('robinet') ||
    s.includes('drain') ||
    s.includes('water heater') ||
    s.includes('chauffe-eau') ||
    s.includes('fuite') ||
    s.includes('leak')
  ) {
    return 'plumbing';
  }

  if (
    s.includes('electr') ||
    s.includes('électr') ||
    s.includes('wire') ||
    s.includes('câbl') ||
    s.includes('cabl') ||
    s.includes('circuit') ||
    s.includes('breaker') ||
    s.includes('disjonct') ||
    s.includes('éclair') ||
    s.includes('lighting')
  ) {
    return 'electrical';
  }

  if (
    s.includes('paint') ||
    s.includes('peint') ||
    s.includes('wall finish') ||
    s.includes('enduit') ||
    s.includes('papier peint')
  ) {
    return 'painting';
  }

  if (
    s.includes('carpent') ||
    s.includes('menuis') ||
    s.includes('wood') ||
    s.includes('bois') ||
    s.includes('cabinet') ||
    s.includes('placard') ||
    s.includes('meuble') ||
    s.includes('porte') ||
    s.includes('charpent')
  ) {
    return 'carpentry';
  }

  if (
    s.includes('mason') ||
    s.includes('maçon') ||
    s.includes('macon') ||
    s.includes('brick') ||
    s.includes('brique') ||
    s.includes('stone') ||
    s.includes('pierre') ||
    s.includes('concrete') ||
    s.includes('béton') ||
    s.includes('ciment') ||
    s.includes('carrel') ||
    s.includes('tile')
  ) {
    return 'masonry';
  }

  if (
    s.includes('clean') ||
    s.includes('nettoy') ||
    s.includes('ménag') ||
    s.includes('menag') ||
    s.includes('wash') ||
    s.includes('lavag') ||
    s.includes('sanit') ||
    s.includes('entretien')
  ) {
    return 'cleaning';
  }

  if (
    s.includes('construct') ||
    s.includes('bâtiment') ||
    s.includes('batiment') ||
    s.includes('build') ||
    s.includes('renovat') ||
    s.includes('drywall') ||
    s.includes('plâtre') ||
    s.includes('platre')
  ) {
    return 'construction';
  }

  if (
    s.includes('mechan') ||
    s.includes('mécan') ||
    s.includes('mecan') ||
    s.includes('motor') ||
    s.includes('moteur') ||
    s.includes('auto') ||
    s.includes('véhic') ||
    s.includes('vehic') ||
    s.includes('car repair') ||
    s.includes('garage') ||
    s.includes('generator') ||
    s.includes('générat')
  ) {
    return 'mechanics';
  }

  if (
    s.includes('pastr') ||
    s.includes('pâtiss') ||
    s.includes('patiss') ||
    s.includes('bak') ||
    s.includes('boulang') ||
    s.includes('cake') ||
    s.includes('gâteau') ||
    s.includes('gateau') ||
    s.includes('dessert')
  ) {
    return 'pastry';
  }

  return s.trim();
}

export function isProviderMatchingTrade(pro: Professional, tradeIdOrName?: string): boolean {
  if (!tradeIdOrName || tradeIdOrName === 'all') return true;
  const targetCanonical = getCanonicalTrade(tradeIdOrName);
  if (!targetCanonical) return true;

  if (getCanonicalTrade(pro.category) === targetCanonical) return true;
  if (getCanonicalTrade(pro.profession) === targetCanonical) return true;
  if (getCanonicalTrade(pro.specialization) === targetCanonical) return true;

  if (
    Array.isArray(pro.skills) &&
    pro.skills.some((sk) => getCanonicalTrade(sk) === targetCanonical)
  ) {
    return true;
  }

  const rawTarget = tradeIdOrName.toLowerCase();
  const pCat = (pro.category || '').toLowerCase();
  const pProf = (pro.profession || '').toLowerCase();
  if (pCat.includes(rawTarget) || rawTarget.includes(pCat)) return true;
  if (pProf.includes(rawTarget) || rawTarget.includes(pProf)) return true;

  return false;
}

export function isSameUserAsPro(
  user?: UserProfile | null,
  pro?: Professional | null
): boolean {
  if (!user || !pro) return false;

  const proId = String(pro.id || (pro as any)._id || '');
  const userId = String(user.id || '');
  if (userId && proId && (proId === userId || (pro as any).userId === userId)) {
    return true;
  }

  if (user.phone && pro.phone) {
    const uPhone = user.phone.replace(/\D/g, '');
    const pPhone = pro.phone.replace(/\D/g, '');
    if (
      uPhone.length >= 8 &&
      pPhone.length >= 8 &&
      (uPhone === pPhone || uPhone.endsWith(pPhone) || pPhone.endsWith(uPhone))
    ) {
      return true;
    }
  }

  if (user.email && (pro as any).email) {
    if (user.email.trim().toLowerCase() === (pro as any).email.trim().toLowerCase()) {
      return true;
    }
  }

  if (user.isProvider && user.name && pro.name) {
    const uName = user.name.trim().toLowerCase();
    const pName = pro.name.trim().toLowerCase();
    if (uName.length > 2 && uName === pName) {
      return true;
    }
  }

  return false;
}
