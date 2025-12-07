import { test } from '../../_fixtures/fixtures';
import { EditProfileSettingsPage } from '../../../src/ui/pages/profile/EditProfileSettingsPage';
import { ViewUserProfilePage } from '../../../src/ui/pages/profile/ViewUserProfilePage';

let newSettings;

test.beforeEach(async ({ loggedInUserAndPage, factories }) => {
  const { registeredUser } = loggedInUserAndPage;

  // keep the same factory API – just pass the registered user from the fixture
  newSettings = factories.userSettings.generateUserSettings({
    user: registeredUser,
  });
});

test('Update URL and Bio settings for registered user', async ({
  loggedInUserAndPage,
}) => {
  const { page } = loggedInUserAndPage;

  const editSettingsPage = new EditProfileSettingsPage(page);
  const viewUserProfilePage = new ViewUserProfilePage(page);

  await editSettingsPage.open();

  await editSettingsPage.fillProfilePictureUrlField(
    newSettings.profilPictureUrl,
  );
  await editSettingsPage.fillBioTextArea(newSettings.bio);
  await editSettingsPage.clickUpdateSettingsButton();

  await editSettingsPage.assertProfilePictureUrlHasValue(
    newSettings.profilPictureUrl,
  );
  await viewUserProfilePage.assertBioHasText(newSettings.bio);
  await viewUserProfilePage.assertUsernameIsCorrect(newSettings.username);

  await viewUserProfilePage.clickEditProfileSettingsLink();

  await editSettingsPage.assertProfilePictureUrlHasValue(
    newSettings.profilPictureUrl,
  );
  await editSettingsPage.assertBioHasValue(newSettings.bio);
});