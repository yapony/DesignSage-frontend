import { FunctionType } from '@/types/function'

export function getFunctionTypeFromInputs(inputs: Record<string, any>): FunctionType {
  const { Mode, internet_needed, Report_needed } = inputs

  if (Mode === 'UXResearch') {
    if (internet_needed === 0 && Report_needed === 0) {
      return 'user-research'
    } else if (internet_needed === 1 && Report_needed === 0) {
      return 'dynamic-query'
    } else if (internet_needed === 0 && Report_needed === 1) {
      return 'report-generation'
    }
  } else if (Mode === 'Conceptual_design') {
    if (internet_needed === 0 && Report_needed === 0) {
      return 'design-trend'
    } else if (internet_needed === 1 && Report_needed === 0) {
      return 'dynamic-query'
    } else if (internet_needed === 0 && Report_needed === 1) {
      return 'report-generation'
    }
  } else if (Mode === 'Detailed_design') {
    if (internet_needed === 0 && Report_needed === 0) {
      return 'design-standard'
    } else if (internet_needed === 1 && Report_needed === 0) {
      return 'dynamic-query'
    } else if (internet_needed === 0 && Report_needed === 1) {
      return 'report-generation'
    }
  }

  // 默认返回当前模块的默认功能
  if (Mode === 'UXResearch') return 'user-research'
  if (Mode === 'Conceptual_design') return 'design-trend'
  if (Mode === 'Detailed_design') return 'design-standard'
  
  return 'user-research' // 最后的默认值
} 