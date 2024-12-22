fun main() {
  val foo = "kotlinc hello.kt -include-runtime -d hello.jar"

  val bar =
          """ 
  -include-runtime packages the Kotlin runtime library into the resulting JAR file, 
  making it a self-contained executable that doesn't require the Kotlin runtime to be installed separately.
  """

  val baz = "java -jar hello.jar"

  print("$foo, $bar, $baz")
}
