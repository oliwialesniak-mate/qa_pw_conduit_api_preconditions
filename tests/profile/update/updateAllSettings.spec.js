import { test, expect } from '../../_fixtures/fixtures';
import { EditProfileSettingsPage } from '../../../src/ui/pages/profile/EditProfileSettingsPage';
import { ViewUserProfilePage } from '../../../src/ui/pages/profile/ViewUserProfilePage';

test('Update all user settings for registered user', async ({
  loggedInUserAndPage,
  factories,
}) => {
  const { page, registeredUser } = loggedInUserAndPage;

  // loggedInUserAndPage fixture creates user via API (requirement)
  // and then logs in through UI. We generate new settings based on this user
  // to avoid username/email collisions (deterministic & stable).

  const newSettings = factories.userSettings.generateUserSettings({
    emailBase: registeredUser.email,
    usernameBase: registeredUser.username,
  });

  const editSettingsPage = new EditProfileSettingsPage(page);
  const viewUserProfilePage = new ViewUserProfilePage(page);

  await editSettingsPage.open();
  await editSettingsPage.assertFormLoaded(); // recommended robustness

  await editSettingsPage.fillProfilePictureUrlField(
    newSettings.profilPictureUrl,
  );
  await editSettingsPage.fillUsernameField(newSettings.username);
  await editSettingsPage.fillBioTextArea(newSettings.bio);
  await editSettingsPage.fillEmailField(newSettings.email);
  await editSettingsPage.clickUpdateSettingsButton();

  // Immediate assertions after saving
  await editSettingsPage.assertProfilePictureUrlHasValue(
    newSettings.profilPictureUrl,
  );

  await viewUserProfilePage.assertBioHasText(newSettings.bio);
  await viewUserProfilePage.assertUsernameIsCorrect(newSettings.username);

  // Navigate back and reassert persistence
  await viewUserProfilePage.clickEditProfileSettingsLink();

  await editSettingsPage.assertProfilePictureUrlHasValue(
    newSettings.profilPictureUrl,
  );
  await editSettingsPage.assertBioHasValue(newSettings.bio);
  await editSettingsPage.assertUsernameHasValue(newSettings.username);
  await editSettingsPage.assertEmailHasValue(newSettings.email);
});
