import subprocess


def run_code_formatters():
    for tool in ["isort .", "black .", "mdformat ."]:
        print(f"running `{tool}`")
        subprocess.run(tool, shell=True)


def run_code_verification():
    tool = "flake8 src/ test/"
    print(f"running `{tool}`")
    subprocess.run(tool, shell=True)
