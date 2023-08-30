//const baseUrl = 'http://192.168.31.110/innothoughts/project-4-dms/public/api/'
//const baseUrl = 'http://localhost/ci4-backend/public/api/'

//for api server
const baseUrl = "https://docuclip.app/ci4-dms-updated/public/api/";

//For usb debugging
//const baseUrl = 'http://localhost:8000/docuclip.app/ci4-dms-updated/public/api/'
//for desktop
//const baseUrl = "http://localhost/docuclip.app/ci4-dms-updated/public/api/";

const apiRoutes = {
  fileInfo: baseUrl + "fileretrivalapi/fileinfo",
  fieldInfo: baseUrl + "fileretrivalapi/fieldinfo",
  getQrCode: baseUrl + "fileretrivalapi/getqrcode",
  fileDownload: baseUrl + "fileretrivalapi/filedownload",
  linkImage: baseUrl + "fileretrivalapi/link_image",
  getCategories: baseUrl + "filetransferapi/getcategories",
  saveData: baseUrl + "filetransferapi/savedata",
  updateData: baseUrl + "filetransferapi/updatedata",
  upload: baseUrl + "filetransferapi/upload",
  uploadFromUrl: baseUrl + "filetransferapi/uploadUrl",
  savefile: baseUrl + "filetransferapi/savefile",
  saveQRfile: baseUrl + "filetransferapi/saveQRfile",
  checkOwnership: baseUrl + "filetransferapi/check_ownership",
  listAll: baseUrl + "fileretrivalapi/listall",
  deleteFile: baseUrl + "fileretrivalapi/delete",
  deleteAccount: baseUrl + "UserDelete",
  login: baseUrl + "login",
  terms: baseUrl + "terms",
  sendOtp: baseUrl + "sendotp",
  loginOtp: baseUrl + "loginotp",
  register: baseUrl + "register",
  getUserInfo: baseUrl + "userprofile/getinfo",
  changePassword: baseUrl + "userprofile/changepassword",
  addName: baseUrl + "userprofile/unregistered",
  generateSecretCode: baseUrl + "userprofile/generateSecretCode",
  howtouse: baseUrl + "fileretrivalapi/howtouseMobile",
  profile: {
    updateDetails: baseUrl + "userprofile/updatedetails",
  },
  notifications: {
    get: baseUrl + "notifications/getnotifications",
    dismiss: baseUrl + "notifications/dismissnotifications",
  },
  statistics: {
    scan: baseUrl + "statistics/scan",
  },
};

export default apiRoutes;
