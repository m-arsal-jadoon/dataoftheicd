export interface IcdCodeSchema {
  code: string;
  short_title: string;
  long_title: string;
  billable_flag: boolean;
  chapter_range: string;
  chapter_title: string;
  category_code: string;
  parent_code: string | null;
  includes_notes: string[];
  excludes1_notes: string[];
  excludes2_notes: string[];
  code_first_notes: string[];
  use_additional_code_notes: string[];
  fiscal_year: number;
  effective_start_date: string;
  effective_end_date: string;
  source_file_version: string;
  slug: string;
  search_keywords: string[];
  related_index_terms: string[];
  plain_english_explanation: string | null;
  compare_targets: string[];
  visual_template_type: 'standard_code_page' | 'parent_node';
}
