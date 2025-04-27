interface MultiLanguageField {
  en: string;
  zh: string;
}

export interface ProfileAdmin {
  introduction: MultiLanguageField;
  education: {
    school: MultiLanguageField;
    degree: MultiLanguageField;
    period: MultiLanguageField;
    description: MultiLanguageField;
  }[];
  skills: {
    name: MultiLanguageField;
    level: number;
  }[];
}

export default ProfileAdmin;
