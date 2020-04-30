// Copyright 2015-present 650 Industries. All rights reserved.

#import <EXDevSupport/EXDevSupportMenuItem.h>
#import <EXDevSupport/EXDevSupportAppInstance.h>
#import <EXDevSupport/EXDevMenuGestureRecognizer.h>
#import <EXDevSupport/EXDevSupportDelegateProtocol.h>

@interface EXDevSupportManager : NSObject

@property (nullable, nonatomic, strong) id<EXDevSupportDelegateProtocol> delegate;
@property (readwrite, nonatomic, assign) BOOL interceptMotionGesture;
@property (readwrite, nonatomic, assign) BOOL interceptTouchGesture;

/**
 * Returns singleton instance of the manager.
 */
+ (nonnull instancetype)sharedInstance;

/**
 * Returns dev support app instance which is a wrapper around React Native's bridge.
 */
- (nonnull EXDevSupportAppInstance *)appInstance;

/**
 * Returns a dictionary with the most important informations about the current app.
 */
- (nullable NSDictionary<NSString *, NSObject *> *)appInfo;

/**
 * Returns an array with dev menu items to render. They are gathered from all modules conforming to EXDevSupportMenuExtensionProtocol.
 */
- (nonnull NSArray<EXDevSupportMenuItem *> *)devMenuItems;

/**
 * Returns bool value whether the dev menu is visible.
 */
- (BOOL)isVisible;

/**
 * Opens the dev menu. Returns `YES` if it succeeded or `NO` if the desired state is already set or its change has been rejected by the delegate.
 */
- (BOOL)open;

/**
 * Closes the dev menu with the animation applied on the JS side. Returns `YES` if it succeeded or `NO` if the desired state is already set or its change has been rejected by the delegate.
 */
- (BOOL)close;

/**
 * Toggles the visibility of the dev menu. Returns `YES` if it succeeded or `NO` if the desired state is already set or its change has been rejected by the delegate.
 */
- (BOOL)toggle;

/**
 * Closes the dev menu but skips JS animation and doesn't return any value as it always succeeds - the delegate can't reject it.
 */
- (void)closeWithoutAnimation;

@end
