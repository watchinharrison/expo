// Copyright 2015-present 650 Industries. All rights reserved.

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, EXDevSupportMenuItemType) {
  EXDevSupportMenuItemTypeAction = 1,
  EXDevSupportMenuItemTypeGroup = 2,
};

@interface EXDevSupportMenuItem : NSObject

@property (nonatomic, assign) EXDevSupportMenuItemType type;
@property (nonatomic, assign) BOOL isAvailable;
@property (nonatomic, assign) BOOL isEnabled;
@property (nonatomic, nullable, strong) NSString *label;
@property (nonatomic, nullable, strong) NSString *detail;
@property (nonatomic, nullable, strong) NSString *glyphName;

- (instancetype)initWithType:(EXDevSupportMenuItemType)type;

- (nonnull NSDictionary<NSString *, NSObject *> *)serialize;

@end

@interface EXDevSupportMenuAction : EXDevSupportMenuItem

@property (nonatomic, nonnull, strong) NSString *actionId;

- (instancetype)initWithId:(nonnull NSString *)actionId;

@end

@interface EXDevSupportMenuGroup : EXDevSupportMenuItem

@property (nonatomic, nullable, strong) NSString *groupName;

- (instancetype)init;
- (instancetype)initWithName:(nullable NSString *)groupName;
- (void)addItem:(nonnull EXDevSupportMenuItem *)item;

@end
