#!/bin/bash

# التحقق من أن المستخدم أدخل اسم الـ feature
if [ -z "$1" ]
then
      echo "Please provide a feature name (example: ./make-feature.sh category)"
      exit 1
fi

FEATURE_NAME=$1
# تحديد مجلد الـ features ليكون المسار دائماً هناك
BASE_DIR="features"

# 2. إنشاء المجلدات الأساسية
mkdir -p "$BASE_DIR/$FEATURE_NAME/models"
mkdir -p "$BASE_DIR/$FEATURE_NAME/services"
mkdir -p "$BASE_DIR/$FEATURE_NAME/validators"
mkdir -p "$BASE_DIR/$FEATURE_NAME/routes"

# 3. إنشاء الملفات فعلياً باستخدام أمر touch
touch "$BASE_DIR/$FEATURE_NAME/models/${FEATURE_NAME}Models.js"
touch "$BASE_DIR/$FEATURE_NAME/services/${FEATURE_NAME}Services.js"
touch "$BASE_DIR/$FEATURE_NAME/validators/${FEATURE_NAME}Validators.js"
touch "$BASE_DIR/$FEATURE_NAME/routes/${FEATURE_NAME}Routes.js"

# 3. تحديد أسماء الملفات
MODEL_FILE="$BASE_DIR/$FEATURE_NAME/models/${FEATURE_NAME}Models.js"
SERVICE_FILE="$BASE_DIR/$FEATURE_NAME/services/${FEATURE_NAME}Services.js"
VALIDATOR_FILE="$BASE_DIR/$FEATURE_NAME/validator/${FEATURE_NAME}Validator.js"
ROUTE_FILE="$BASE_DIR/$FEATURE_NAME/routes/${FEATURE_NAME}Routes.js"
echo "✅ Feature: $FEATURE_NAME created successfully!"
echo "📂 Folders: models, services, validator, routes"

# ./make-feature.sh <feature-name>  