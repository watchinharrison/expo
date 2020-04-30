// Copyright 2015-present 650 Industries. All rights reserved.

#import <React/RCTDevSettings.h>

#import <EXDevSupport/EXDevSupportManager.h>
#import <EXDevSupport/EXDevMenuWindow.h>
#import <EXDevSupport/EXDevMenuMotionInterceptor.h>
#import <EXDevSupport/EXDevMenuGestureInterceptor.h>
#import <EXDevSupport/EXDevSupportMenuExtensionProtocol.h>

static NSString *kEXDevMenuMotionGestureEnabled = @"EXDevMenuMotionGestureEnabled";
static NSString *kEXDevMenuTouchGestureEnabled = @"EXDevMenuTouchGestureEnabled";

@implementation EXDevSupportManager
{
  EXDevMenuWindow *_window;
  EXDevSupportAppInstance *_appInstance;
}

+ (instancetype)sharedInstance
{
  static EXDevSupportManager *manager;
  static dispatch_once_t once;
  dispatch_once(&once, ^{
    if (!manager) {
      manager = [EXDevSupportManager new];
    }
  });
  return manager;
}

- (instancetype)init
{
  if (self = [super init]) {
    _appInstance = [[EXDevSupportAppInstance alloc] init];

    // Read initial attributes from user defaults.
    id motionGestureEnabled = [[NSUserDefaults standardUserDefaults] objectForKey:kEXDevMenuMotionGestureEnabled];
    id touchGestureEnabled = [[NSUserDefaults standardUserDefaults] objectForKey:kEXDevMenuTouchGestureEnabled];
    self.interceptMotionGesture = motionGestureEnabled != nil ? [motionGestureEnabled boolValue] : YES;
    self.interceptTouchGesture = touchGestureEnabled != nil ? [touchGestureEnabled boolValue] : YES;
  }
  return self;
}

#pragma mark - API

- (BOOL)interceptMotionGesture
{
  return [EXDevMenuMotionInterceptor isInstalled];
}

- (void)setInterceptMotionGesture:(BOOL)interceptMotionGesture
{
  interceptMotionGesture ? [EXDevMenuMotionInterceptor install] : [EXDevMenuMotionInterceptor uninstall];
  [[NSUserDefaults standardUserDefaults] setBool:interceptMotionGesture forKey:kEXDevMenuMotionGestureEnabled];
}

- (BOOL)interceptTouchGesture
{
  return [EXDevMenuGestureInterceptor isInstalled];
}

- (void)setInterceptTouchGesture:(BOOL)interceptTouchGesture
{
  interceptTouchGesture ? [EXDevMenuGestureInterceptor install] : [EXDevMenuGestureInterceptor uninstall];
  [[NSUserDefaults standardUserDefaults] setBool:interceptTouchGesture forKey:kEXDevMenuTouchGestureEnabled];
}

- (nonnull EXDevSupportAppInstance *)appInstance
{
  return _appInstance;
}

- (nullable NSDictionary<NSString *, NSObject *> *)appInfo
{
  return [_delegate appInfoForDevSupportManager:self];
}

- (nonnull NSArray<EXDevSupportMenuItem *> *)devMenuItems
{
  id<EXDevSupportBridgeProtocol> appBridge = [_delegate appBridgeForDevSupportManager:self];
  NSArray *modules = [appBridge modulesConformingToProtocol:@protocol(EXDevSupportMenuExtensionProtocol)];
  NSMutableArray *items = [NSMutableArray new];

  for (id<EXDevSupportMenuExtensionProtocol> module in modules) {
    NSArray *moduleItems = [module devMenuItems];
    if (moduleItems) {
      [items addObjectsFromArray:moduleItems];
    }
  }
  return items;
}

- (BOOL)isVisible
{
  return _window ? !_window.hidden : NO;
}

- (BOOL)open
{
  if (![self canChangeVisibility:YES]) {
    return NO;
  }
  [self setVisibility:YES];
  return YES;
}

- (BOOL)close
{
  [self closeWithoutAnimation];
  return YES;
//  if (![self canChangeVisibility:NO]) {
//    return NO;
//  }
//  EXHomeModule *homeModule = [[self mainBridge] moduleForName:@"ExponentKernel"];
//
//  if (homeModule) {
//    // This will trigger `closeWithoutAnimation` once the animation is finished.
//    [homeModule requestToCloseDevMenu];
//  } else {
//    // Module not found, close immediately?
//    [self closeWithoutAnimation];
//  }
//
//  return YES;
}

- (BOOL)toggle
{
  return self.isVisible ? [self close] : [self open];
}

- (void)closeWithoutAnimation
{
  [self setVisibility:NO];
}

#pragma mark - delegate stubs

- (BOOL)canChangeVisibility:(BOOL)visible
{
  if (self.isVisible == visible) {
    return NO;
  }
  if ([_delegate respondsToSelector:@selector(devMenuManager:canChangeVisibility:)]) {
    return [_delegate devMenuManager:self canChangeVisibility:visible];
  }
  return YES;
}

#pragma mark - internal

- (void)setVisibility:(BOOL)visible
{
  dispatch_async(dispatch_get_main_queue(), ^{
    if (!self->_window) {
      self->_window = [[EXDevMenuWindow alloc] initWithManager:self];
    }
    if (visible) {
      [self->_window makeKeyAndVisible];
    } else {
      self->_window.hidden = YES;
    }
  });
}

- (id)moduleInstanceForBridge:(id<EXDevSupportBridgeProtocol>)bridge named:(NSString *)name
{
  return [[[bridge batchedBridge] moduleDataForName:name] instance];
}

@end
