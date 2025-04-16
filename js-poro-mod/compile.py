from pathlib import Path
import shutil
import subprocess
import zipfile


class JSCompiler:
    """
    A class to compile JavaScript code using Webpack and copy the minified version
    to specified plugin directories.

    Attributes:
        BASE_DIR (Path): The base directory where the script is located.
        ROOT_DIR (Path): The root directory one level up from the base directory.
        MIN_NAME (str): The name of the minified JavaScript file.
        MIN_FILE (Path): The path to the minified JavaScript file.
        CHROME_DIR (Path): The path to the Chrome plugin directory.
        FIREFOX_DIR (Path): The path to the Firefox plugin directory.
    """

    BASE_DIR: Path = Path(__file__).resolve().parent
    ROOT_DIR: Path = BASE_DIR.parent
    MIN_NAME: str = "mod.min.js"
    MIN_FILE: Path = BASE_DIR / MIN_NAME
    CHROME_DIR: Path = ROOT_DIR / "Chrome"
    FIREFOX_DIR: Path = ROOT_DIR / "Firefox"
    CHROME_ZIP: Path = ROOT_DIR / "Plugin_PoRoMOD_Chrome.zip"
    FIREFOX_XPI: Path = ROOT_DIR / "Plugin_PoRoMOD_Firefox.xpi"

    @classmethod
    def setup_directories(cls) -> None:
        """
        Creates the Chrome and Firefox directories if they do not already exist.
        """
        cls.CHROME_DIR.mkdir(parents=True, exist_ok=True)
        cls.FIREFOX_DIR.mkdir(parents=True, exist_ok=True)

    @classmethod
    def compile_js(cls) -> bool:
        """
        Compiles the JavaScript code using Webpack.

        Returns:
            bool: True if the compilation was successful, False otherwise.
        """
        try:
            subprocess.run(
                ["npx", "webpack", "--config", "webpack.config.js"],
                check=True,
                shell=True,
                cwd=cls.BASE_DIR,
            )
            return True
        except subprocess.CalledProcessError as e:
            print(f"Compilation failed: {e}")
            return False

    @classmethod
    def copy_minified_js(cls) -> None:
        """
        Copies the compiled minified JavaScript file to the Chrome and Firefox directories.

        Raises:
            FileNotFoundError: If the minified JavaScript file does not exist.
        """
        if not cls.MIN_FILE.exists():
            raise FileNotFoundError(
                f"{cls.MIN_NAME} does not exist in the base directory."
            )
        shutil.copy(cls.MIN_FILE, cls.CHROME_DIR / cls.MIN_NAME)
        shutil.copy(cls.MIN_FILE, cls.FIREFOX_DIR / cls.MIN_NAME)

    @classmethod
    def delete_old_zips(cls) -> None:
        """
        Deletes the old zip files if they exist.
        """
        if cls.CHROME_ZIP.exists():
            cls.CHROME_ZIP.unlink()
        if cls.FIREFOX_XPI.exists():
            cls.FIREFOX_XPI.unlink()

    @classmethod
    def create_zips(cls) -> None:
        """
        Creates zip files for the Chrome and Firefox directories.
        """
        cls.delete_old_zips()

        with zipfile.ZipFile(cls.CHROME_ZIP, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file in cls.CHROME_DIR.rglob("*"):
                if file.is_file():
                    relative_path = file.relative_to(cls.CHROME_DIR)
                    zipf.write(file, relative_path)

        with zipfile.ZipFile(cls.FIREFOX_XPI, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file in cls.FIREFOX_DIR.rglob("*"):
                if file.is_file():
                    relative_path = file.relative_to(cls.FIREFOX_DIR)
                    zipf.write(file, relative_path)

    @classmethod
    def run(cls) -> None:
        """
        Runs the complete process of compiling JavaScript and copying the minified version
        to the target directories, then creating zip files of the directories.
        """
        cls.setup_directories()
        if cls.compile_js():
            cls.copy_minified_js()
            cls.create_zips()


if __name__ == "__main__":
    JSCompiler.run()
