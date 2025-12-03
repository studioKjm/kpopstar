/**
 * AI 모듈 메인 엔트리포인트
 * 
 * 사용 예시:
 * 
 * // 기능 함수 사용
 * import { generateTags, checkFacts } from '@/lib/ai';
 * const tags = await generateTags(content);
 * 
 * // 프로바이더 직접 접근
 * import { getActiveProvider, getProvider } from '@/lib/ai';
 * const provider = getActiveProvider();
 * const gemini = getProvider('gemini');
 */

// 타입 내보내기
export type {
  AIProviderInterface,
  GenerateOptions,
  PromptTemplate,
  AIFeatureType,
  AIProvider,
  AIRequest,
  AIResponse,
  AutoTagResponse,
  SummarizeResponse,
  CategorySuggestResponse,
  FactCheckResult,
  StyleAnalysisResult,
  DuplicateCheckResult,
  SensitivityResult,
} from './types';

// 프로바이더 내보내기
export {
  getActiveProvider,
  getActiveProviderType,
  getProvider,
  getProvidersStatus,
  initializeAllProviders,
  Base44Provider,
  GeminiProvider,
  getBase44Provider,
  getGeminiProvider,
} from './providers';

// AI 기능 함수 내보내기
export {
  generateTags,
  checkFacts,
  unifyStyle,
  checkDuplicates,
  summarize,
  suggestCategory,
  checkSensitivity,
  runFullValidation,
} from './features';

// 프롬프트 유틸리티 내보내기
export {
  fillPromptTemplate,
  getPromptByFeature,
  SYSTEM_PROMPTS,
} from './prompts';

