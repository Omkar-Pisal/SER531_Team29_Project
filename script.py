import subprocess
import os
import webbrowser

def setup_and_run_server():
    print("Setting up and running the server...")
    os.chdir('server')  # Change directory to server
    subprocess.run(['npm', 'install'])  # Install dependencies
    subprocess.Popen(['nodemon', 'app.js'])  # Run the server
    os.chdir('..')  # Change back to the project root directory

def open_client():
    print("Opening the client...")
    client_index_path = os.path.abspath('client/index.html')
    webbrowser.open(f'file://{client_index_path}')

if __name__ == '__main__':
    setup_and_run_server()
    open_client()
