const DEFAULT_MOCK_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMSIsInVzZXJuYW1lIjoibW9jay1zdHVkZW50IiwiZW1haWwiOiJtb2NrLnN0dWRlbnRAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzgxNTYzNDksImV4cCI6MTc4MDc0ODM0OX0.ZXS5Uqx-7PO2nEORhFKScSKL7K0wa8BiCdI5hbMlcwE";

export const MOCK_PROFILE = {
  name: "Mock Student",
  email: "mock.student@example.com",
  university: "UniHub University",
  major: "Software Design",
};

export function getMockAccessToken(): string {
  return (
    process.env.NEXT_PUBLIC_MOCK_ACCESS_TOKEN?.trim() ||
    DEFAULT_MOCK_ACCESS_TOKEN
  );
}
