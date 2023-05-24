import { Rules } from '@/store/reviewInvites/types'

export const getActiveOrFirstRuleId = (rules: Rules[]): string => {
  const activeRulesId = rules.find(rule => rule.active)?.id

  if (activeRulesId) {
    return activeRulesId
  }
  return rules.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    .id
}
