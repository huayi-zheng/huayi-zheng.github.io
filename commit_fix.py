#!/usr/bin/env python3
import subprocess
import os

os.chdir(r"C:\Users\DELL\WorkBuddy\Claw\huayi-zheng.github.io")

# 提交
print("[INFO] 提交更改...")
result = subprocess.run(
    ["git", "commit", "-m", "Unify navbar style with other pages"],
    capture_output=True,
    text=True
)
print(result.stdout)
if result.stderr:
    print("[STDERR]", result.stderr)

# 推送
print("\n[INFO] 推送到GitHub...")
result = subprocess.run(
    ["git", "push"],
    capture_output=True,
    text=True
)
print(result.stdout)
if result.stderr:
    print("[STDERR]", result.stderr)

print("\n[OK] 完成!")
