from pathlib import Path
import shutil
import subprocess
import platform
import tempfile
import zipfile


class AppCompiler:
    _OS = platform.system().lower()

    BASE_DIR = Path(__file__).resolve().parent
    DIST_DIR = BASE_DIR / "dist"
    ROOT_DIR = BASE_DIR.parent

    ZIP_MAP = {
        "win": ROOT_DIR / "App_Windows.zip",
        "mac": ROOT_DIR / "App_Mac.zip",
        "linux": ROOT_DIR / "App_Linux.zip",
    }

    PLATFORM_MAPPING = {
        "windows": "win",
        "darwin": "mac",
        "linux": "linux",
    }

    @classmethod
    def compile_app(cls, os_name: str, working_dir: Path) -> bool:
        try:
            if cls._OS == "windows":
                subprocess.run(["npm", "install"], check=True, cwd=working_dir, shell=True)
                subprocess.run(["npm", "run", f"build:{os_name}"], check=True, cwd=working_dir, shell=True)
            else:
                subprocess.run("npm install", check=True, cwd=working_dir, shell=True)
                subprocess.run(f"npm run build:{os_name}", check=True, cwd=working_dir, shell=True)
            return True
        except subprocess.CalledProcessError as e:
            print(f"[ERROR] Compilation for {os_name} failed: {e}")
            return False

    @staticmethod
    def zip_dir(src_dir: Path, zip_path: Path) -> None:
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file in src_dir.rglob("*"):
                if file.is_file():
                    zipf.write(file, arcname=file.relative_to(src_dir))

    @classmethod
    def copy_project_to_tmp(cls, exclude=("dist", "node_modules")) -> Path:
        temp_dir = Path(tempfile.mkdtemp())
        temp_build_dir = temp_dir / "build"
        temp_build_dir.mkdir()

        for item in cls.BASE_DIR.iterdir():
            if item.name in exclude:
                continue
            dest = temp_build_dir / item.name
            if item.is_dir():
                shutil.copytree(item, dest, dirs_exist_ok=True)
            else:
                shutil.copy2(item, dest)

        return temp_build_dir

    @classmethod
    def run(cls) -> None:
        os_key = cls.PLATFORM_MAPPING.get(cls._OS)
        if os_key is None:
            print(f"[ERROR] Unsupported platform: {cls._OS}")
            return

        zip_output = cls.ZIP_MAP[os_key]

        if os_key == "linux" and "/mnt/" in str(cls.BASE_DIR):
            print("[INFO] Using temporary WSL path to avoid mount issues...")
            tmp_project = cls.copy_project_to_tmp()
            tmp_dist = tmp_project / "dist"
            tmp_zip = tmp_project.parent / zip_output.name

            if cls.compile_app(os_key, tmp_project):
                cls.zip_dir(tmp_dist, tmp_zip)
                shutil.copyfile(tmp_zip, zip_output)  # ← fixed
                print(f"[✓] Build and zip completed for {os_key} (from WSL tmp)")
            else:
                print(f"[✗] Build failed for {os_key} (in WSL tmp)")
        else:
            if cls.compile_app(os_key, cls.BASE_DIR):
                cls.zip_dir(cls.DIST_DIR, zip_output)
                print(f"[✓] Build and zip completed for {os_key}")
            else:
                print(f"[✗] Build failed for {os_key}")


if __name__ == "__main__":
    AppCompiler.run()
