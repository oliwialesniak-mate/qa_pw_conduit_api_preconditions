import { test, expect } from '../../_fixtures/fixtures';
import { INVALID_EMAIL_OR_PASSWORD_MESSAGE } from '../../../src/ui/constants/authErrorMessages';
import { SignInPage } from '../../../src/ui/pages/auth/SignInPage';

test('Login with old password after it was updated via API', async ({
  page,
  registeredUser,
  factories,
  usersApi,
}) => {
  const signInPage = new SignInPage(page);

  // This test intentionally uses registeredUser instead of loggedInUserAndPage
  // because it must start from a fully logged-out context and perform a UI login.
  // registeredUser is always created via the Conduit API (fixture requirement).

  const newPassword = factories.user.generatePassword();
  const updatedUser = { ...registeredUser, password: newPassword };

  const response = await usersApi.updateUser(updatedUser, registeredUser.token);
  expect(response.status()).toBe(200); // stronger assertion than ok()

  await signInPage.open();
  await signInPage.assertFormVisible(); // recommended robustness

  await signInPage.fillEmailField(registeredUser.email);
  await signInPage.fillPasswordField(registeredUser.password);
  await signInPage.clickSignInButton();

  await signInPage.assertErrorMessageContainsText(
    INVALID_EMAIL_OR_PASSWORD_MESSAGE,
  );
});
