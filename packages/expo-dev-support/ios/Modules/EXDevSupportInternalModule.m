// Copyright 2015-present 650 Industries. All rights reserved.

#import <EXDevSupport/EXDevSupportInternalModule.h>

@implementation EXDevSupportInternalModule
{
  __weak EXDevSupportManager *_manager;
}

- (instancetype)initWithManager:(nullable EXDevSupportManager *)manager
{
  if (self = [super init]) {
    _manager = manager;
  }
  return self;
}

#pragma mark - RCTBridgeModule

+ (NSString *)moduleName
{
  return @"ExpoDevSupportInternal";
}

#pragma mark - JavaScript API

/**
 * Immediately closes the dev menu if it's visible.
 * Note: It skips the animation that would have been applied by the JS side.
 */
RCT_EXPORT_METHOD(closeMenuAsync)
{
  [_manager closeWithoutAnimation];
}

@end
