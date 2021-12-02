#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "AppDelegate+FCMPlugin.h"
#import "FCMNotificationCenterDelegate.h"
#import "FCMPlugin.h"
#import "FCMPluginIOS9Support.h"

FOUNDATION_EXPORT double CordovaPluginsStaticVersionNumber;
FOUNDATION_EXPORT const unsigned char CordovaPluginsStaticVersionString[];

