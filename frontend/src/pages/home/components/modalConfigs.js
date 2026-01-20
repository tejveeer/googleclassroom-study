export const courseFormRules = {
  courseName: {
    required: "Course name is required",
    maxLength: {
      value: 10,
      message: "Course name must be at most 10 characters",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },

  courseRoom: {
    required: "Course room is required",
    maxLength: {
      value: 3,
      message: "Course room must be at most 3 characters",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },

  bannerColor: {
    required: "Banner color is required",
    pattern: {
      value: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      message: "Enter a valid hex color (e.g. #fff or #ffffff)",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },
};

export const joinCourseFormRules = {
  joinId: {
    required: "Course code is required",
    maxLength: {
      value: 10,
      message: "Course name must be at most 10 characters",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },
};
